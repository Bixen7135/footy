"""Footy API - Main application entry point."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from slowapi.errors import RateLimitExceeded
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.redis import RedisManager
from app.core.logging import setup_logging, get_logger
from app.core.exceptions import FootyException
from app.core.exception_handlers import (
    footy_exception_handler,
    validation_exception_handler,
    http_exception_handler,
    unhandled_exception_handler,
)
from app.core.rate_limit import limiter, rate_limit_exceeded_handler
from app.core.security_headers import SecurityHeadersMiddleware
from app.core.request_limits import RequestSizeLimitMiddleware
from app.api.v1 import health, products, categories, cart, auth, orders, users, wishlist, events
from app.api.v1.admin import router as admin_router

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    setup_logging(settings.debug)
    logger.info(
        "Application starting",
        extra={
            "app_name": settings.app_name,
            "environment": settings.environment,
            "debug": settings.debug,
        },
    )
    await RedisManager.init()
    yield
    # Shutdown
    logger.info("Application shutting down", extra={"app_name": settings.app_name})
    await RedisManager.close()


app = FastAPI(
    title=settings.app_name,
    description="Footy Online Footwear Store API",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    openapi_tags=[
        {"name": "health", "description": "Health check endpoints"},
        {"name": "auth", "description": "Authentication endpoints"},
        {"name": "products", "description": "Product catalog endpoints"},
        {"name": "categories", "description": "Category endpoints"},
        {"name": "cart", "description": "Shopping cart endpoints"},
        {"name": "orders", "description": "Order management endpoints"},
        {"name": "users", "description": "User profile endpoints"},
        {"name": "wishlist", "description": "Wishlist endpoints"},
        {"name": "events", "description": "Clickstream event endpoints"},
        {"name": "admin", "description": "Admin endpoints"},
    ],
)

# Add limiter to app state for rate limiting
app.state.limiter = limiter

# Register exception handlers
app.add_exception_handler(FootyException, footy_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)
app.add_exception_handler(Exception, unhandled_exception_handler)

# Add middleware (order matters - first added = outermost = runs first on request)
# 1. Security headers (runs on all responses)
app.add_middleware(SecurityHeadersMiddleware)

# 2. Request size limits (reject large requests early)
app.add_middleware(RequestSizeLimitMiddleware)

# 3. CORS middleware (environment-aware)
if settings.is_development:
    # Permissive CORS for development
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Authorization", "Content-Type"],
    )
else:
    # Stricter CORS for production/staging
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
        max_age=600,  # 10 minutes cache for preflight
    )

# Include routers
app.include_router(health.router, prefix=settings.api_v1_prefix)
app.include_router(products.router, prefix=settings.api_v1_prefix)
app.include_router(categories.router, prefix=settings.api_v1_prefix)
app.include_router(cart.router, prefix=settings.api_v1_prefix)
app.include_router(auth.router, prefix=settings.api_v1_prefix)
app.include_router(orders.router, prefix=settings.api_v1_prefix)
app.include_router(users.router, prefix=settings.api_v1_prefix)
app.include_router(wishlist.router, prefix=settings.api_v1_prefix)
app.include_router(events.router, prefix=settings.api_v1_prefix)
app.include_router(admin_router, prefix=settings.api_v1_prefix)


@app.get("/")
async def root():
    return {"message": "Welcome to Footy API", "docs": "/docs"}
