"""FastAPI exception handlers for consistent error responses."""
from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.exceptions import FootyException
from app.core.logging import get_logger

logger = get_logger(__name__)


async def footy_exception_handler(request: Request, exc: FootyException) -> JSONResponse:
    """Handle custom Footy exceptions."""
    logger.warning(
        "Application error",
        extra={
            "error_code": exc.error_code,
            "status_code": exc.status_code,
            "message": exc.message,
            "path": str(request.url.path),
            "method": request.method,
            "details": exc.details,
        },
    )

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.error_code,
                "message": exc.message,
                "details": exc.details,
            }
        },
    )


async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    """Handle Pydantic validation errors."""
    errors = []
    for error in exc.errors():
        errors.append(
            {
                "field": ".".join(str(loc) for loc in error["loc"]),
                "message": error["msg"],
                "type": error["type"],
            }
        )

    logger.warning(
        "Validation error",
        extra={
            "path": str(request.url.path),
            "method": request.method,
            "errors": errors,
        },
    )

    return JSONResponse(
        status_code=422,
        content={
            "error": {
                "code": "ValidationError",
                "message": "Request validation failed",
                "details": {"errors": errors},
            }
        },
    )


async def http_exception_handler(
    request: Request, exc: StarletteHTTPException
) -> JSONResponse:
    """Handle standard HTTP exceptions."""
    logger.warning(
        "HTTP error",
        extra={
            "status_code": exc.status_code,
            "detail": exc.detail,
            "path": str(request.url.path),
            "method": request.method,
        },
    )

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": "HTTPError",
                "message": str(exc.detail),
                "details": {},
            }
        },
    )


async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Handle unhandled exceptions."""
    logger.exception(
        "Unhandled exception",
        extra={
            "path": str(request.url.path),
            "method": request.method,
            "exception_type": type(exc).__name__,
        },
    )

    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": "InternalServerError",
                "message": "An unexpected error occurred",
                "details": {},
            }
        },
    )
