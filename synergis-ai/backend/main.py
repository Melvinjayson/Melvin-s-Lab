from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.logging import setup_logging
from app.core.error_handlers import setup_error_handlers
from app.core.rate_limiter import RateLimiter
from app.core.docs import custom_openapi
from app.db.session import init_db, close_db_connection
from app.api import auth, consultation

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Setup
    setup_logging()
    init_db()
    
    yield
    
    # Cleanup
    close_db_connection()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan,
)

# Set custom OpenAPI schema
app.openapi = lambda: custom_openapi(app)

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set up rate limiting
app.add_middleware(
    RateLimiter,
    requests_limit=settings.RATE_LIMIT_REQUESTS,
    window_seconds=settings.RATE_LIMIT_WINDOW_SECONDS,
    exclude_paths=[
        f"{settings.API_V1_STR}/docs",
        f"{settings.API_V1_STR}/redoc",
        f"{settings.API_V1_STR}/openapi.json",
    ]
)

# Set up error handlers
setup_error_handlers(app)

# Include routers
app.include_router(
    auth.router,
    prefix=f"{settings.API_V1_STR}/auth",
    tags=["auth"]
)

app.include_router(
    consultation.router,
    prefix=f"{settings.API_V1_STR}/consultation",
    tags=["consultation"]
)

@app.get("/")
async def root():
    return {
        "message": "Welcome to Synergis AI API",
        "version": settings.VERSION,
        "docs": f"{settings.API_V1_STR}/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.SERVER_HOST,
        port=settings.SERVER_PORT,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower(),
    )