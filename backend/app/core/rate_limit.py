"""Rate limiting configuration using slowapi."""
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


def get_real_client_ip(request: Request) -> str:
    """Get client IP, considering proxies.

    Args:
        request: The incoming request.

    Returns:
        The client's real IP address.

    Note:
        Only trusts X-Forwarded-For and X-Real-IP headers when
        settings.trust_proxy_headers is True. This prevents header
        spoofing when the backend is directly reachable.
    """
    # Only trust proxy headers when explicitly configured
    if not settings.trust_proxy_headers:
        return get_remote_address(request)

    # Check for forwarded header (behind reverse proxy)
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()

    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip

    return get_remote_address(request)


# Create limiter instance with Redis storage
limiter = Limiter(
    key_func=get_real_client_ip,
    default_limits=[f"{settings.rate_limit_requests}/minute"],
    storage_uri=settings.redis_url,
    strategy="fixed-window",
)


async def rate_limit_exceeded_handler(
    request: Request, exc: RateLimitExceeded
) -> JSONResponse:
    """Custom handler for rate limit exceeded errors.

    Args:
        request: The incoming request.
        exc: The rate limit exceeded exception.

    Returns:
        JSON response with error details.
    """
    logger.warning(
        "Rate limit exceeded",
        extra={
            "client_ip": get_real_client_ip(request),
            "path": str(request.url.path),
            "method": request.method,
            "limit": str(exc.detail),
        },
    )

    return JSONResponse(
        status_code=429,
        content={
            "error": {
                "code": "RateLimitExceeded",
                "message": "Too many requests",
                "details": {
                    "retry_after": 60,
                },
            }
        },
        headers={"Retry-After": "60"},
    )
