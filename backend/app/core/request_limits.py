"""Request size limit middleware."""
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse, Response

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


class RequestSizeLimitMiddleware(BaseHTTPMiddleware):
    """Limit request body size to prevent abuse."""

    async def dispatch(self, request: Request, call_next) -> Response:
        # Check Content-Length header
        content_length = request.headers.get("Content-Length")

        if content_length:
            try:
                size = int(content_length)
                if size > settings.max_request_size_bytes:
                    logger.warning(
                        "Request too large",
                        extra={
                            "content_length": size,
                            "max_size": settings.max_request_size_bytes,
                            "path": str(request.url.path),
                            "method": request.method,
                        },
                    )
                    return JSONResponse(
                        status_code=413,
                        content={
                            "error": {
                                "code": "RequestTooLarge",
                                "message": "Request body too large",
                                "details": {
                                    "max_size_bytes": settings.max_request_size_bytes,
                                    "received_bytes": size,
                                },
                            }
                        },
                    )
            except ValueError:
                # Invalid Content-Length header, let it pass through
                pass

        return await call_next(request)
