from fastapi.openapi.utils import get_openapi
from app.core.config import settings

def custom_openapi(app):
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description="""Synergis AI API - Your AI Co-Founder

        Key Features:
        * User Authentication & Management
        * AI Consultation Sessions
        * Business Recommendations
        * Analytics & Insights
        """,
        routes=app.routes,
    )

    # Custom documentation settings
    openapi_schema["info"]["x-logo"] = {
        "url": "https://your-domain.com/logo.png"
    }

    # Security schemes
    openapi_schema["components"]["securitySchemes"] = {
        "bearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }

    # Global security
    openapi_schema["security"] = [{
        "bearerAuth": []
    }]

    # Custom tags metadata
    openapi_schema["tags"] = [
        {
            "name": "auth",
            "description": "Authentication operations",
        },
        {
            "name": "users",
            "description": "Operations with users",
        },
        {
            "name": "consultation",
            "description": "AI consultation and recommendations",
        },
        {
            "name": "analytics",
            "description": "Business analytics and insights",
        },
    ]

    # Add responses that are common across endpoints
    openapi_schema["components"]["responses"] = {
        "UnauthorizedError": {
            "description": "Authentication failed",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "Could not validate credentials"
                    }
                }
            }
        },
        "ValidationError": {
            "description": "Validation failed",
            "content": {
                "application/json": {
                    "example": {
                        "detail": [
                            {
                                "loc": ["body", "field_name"],
                                "msg": "field required",
                                "type": "value_error.missing"
                            }
                        ]
                    }
                }
            }
        }
    }

    app.openapi_schema = openapi_schema
    return app.openapi_schema