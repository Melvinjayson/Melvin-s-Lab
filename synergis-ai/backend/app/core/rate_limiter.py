from datetime import datetime, timedelta
from typing import Dict, Tuple
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

class RateLimiter(BaseHTTPMiddleware):
    def __init__(
        self,
        app,
        requests_limit: int = 100,
        window_seconds: int = 60,
        exclude_paths: list = None
    ):
        super().__init__(app)
        self.requests_limit = requests_limit
        self.window_seconds = window_seconds
        self.exclude_paths = exclude_paths or []
        self.requests: Dict[str, list] = {}

    async def dispatch(self, request: Request, call_next):
        if any(request.url.path.startswith(path) for path in self.exclude_paths):
            return await call_next(request)

        client_ip = request.client.host
        current_time = datetime.now()

        # Clean up old requests
        if client_ip in self.requests:
            self.requests[client_ip] = [
                req_time for req_time in self.requests[client_ip]
                if current_time - req_time < timedelta(seconds=self.window_seconds)
            ]

        # Check rate limit
        if self._is_rate_limited(client_ip, current_time):
            return JSONResponse(
                status_code=429,
                content={
                    "detail": "Too many requests",
                    "retry_after": self._get_retry_after(client_ip)
                }
            )

        # Add current request
        if client_ip not in self.requests:
            self.requests[client_ip] = []
        self.requests[client_ip].append(current_time)

        response = await call_next(request)
        return response

    def _is_rate_limited(self, client_ip: str, current_time: datetime) -> bool:
        if client_ip not in self.requests:
            return False

        window_start = current_time - timedelta(seconds=self.window_seconds)
        request_count = len([
            req_time for req_time in self.requests[client_ip]
            if req_time > window_start
        ])

        return request_count >= self.requests_limit

    def _get_retry_after(self, client_ip: str) -> int:
        if not self.requests[client_ip]:
            return 0

        oldest_request = min(self.requests[client_ip])
        time_passed = datetime.now() - oldest_request
        return max(0, self.window_seconds - int(time_passed.total_seconds()))

    def _get_window_stats(self, client_ip: str) -> Tuple[int, int]:
        if client_ip not in self.requests:
            return 0, self.requests_limit

        current_time = datetime.now()
        window_start = current_time - timedelta(seconds=self.window_seconds)
        request_count = len([
            req_time for req_time in self.requests[client_ip]
            if req_time > window_start
        ])

        return request_count, self.requests_limit