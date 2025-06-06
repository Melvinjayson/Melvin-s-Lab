import logging
import sys
from pathlib import Path
from loguru import logger
from app.core.config import settings

class InterceptHandler(logging.Handler):
    def emit(self, record):
        # Get corresponding Loguru level if it exists
        try:
            level = logger.level(record.levelname).name
        except ValueError:
            level = record.levelno

        # Find caller from where originated the logged message
        frame, depth = logging.currentframe(), 2
        while frame.f_code.co_filename == logging.__file__:
            frame = frame.f_back
            depth += 1

        logger.opt(depth=depth, exception=record.exc_info).log(
            level, record.getMessage()
        )

def setup_logging():
    # Remove all handlers from root logger
    logging.root.handlers = []

    # Set logging level
    logging.root.setLevel(settings.LOG_LEVEL)

    # Create logs directory if it doesn't exist
    logs_path = Path("logs")
    logs_path.mkdir(exist_ok=True)

    # Configure loguru
    config = {
        "handlers": [
            {
                "sink": sys.stdout,
                "format": "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
                "level": settings.LOG_LEVEL,
            },
            {
                "sink": str(logs_path / "app.log"),
                "format": "{time:YYYY-MM-DD HH:mm:ss.SSS} | {level: <8} | {name}:{function}:{line} - {message}",
                "level": settings.LOG_LEVEL,
                "rotation": "1 day",
                "retention": "1 week",
                "compression": "zip",
            },
        ],
    }

    # Configure loguru with our settings
    logger.configure(**config)

    # Intercept everything at the root logger
    logging.root.handlers = [InterceptHandler()]

    # Remove every other logger's handlers and propagate to root logger
    for name in logging.root.manager.loggerDict.keys():
        logging.getLogger(name).handlers = []
        logging.getLogger(name).propagate = True

    # Configure standard library logging modules to use loguru
    logging_modules = [
        "uvicorn",
        "uvicorn.access",
        "uvicorn.error",
        "fastapi",
        "sqlalchemy",
        "alembic",
    ]

    for module in logging_modules:
        mod_logger = logging.getLogger(module)
        mod_logger.handlers = [InterceptHandler()]

    return logger