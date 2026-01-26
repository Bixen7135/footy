"""Redis connection management."""
from typing import Optional
import redis.asyncio as redis

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


class RedisManager:
    """Manage Redis connection."""

    _client: Optional[redis.Redis] = None
    _initialized: bool = False

    @classmethod
    async def init(cls) -> None:
        """Initialize Redis connection and verify connectivity.

        Raises:
            Exception: If Redis connection fails.
        """
        if cls._initialized:
            return

        try:
            cls._client = redis.from_url(
                settings.redis_url,
                encoding="utf-8",
                decode_responses=True,
            )
            # Test connection
            await cls._client.ping()
            cls._initialized = True
            # Log URL without credentials
            safe_url = settings.redis_url.split("@")[-1] if "@" in settings.redis_url else settings.redis_url
            logger.info("Redis connection established", extra={"url": safe_url})
        except Exception as e:
            logger.error("Redis connection failed", extra={"error": str(e)})
            raise

    @classmethod
    async def get_client(cls) -> redis.Redis:
        """Get or create Redis client."""
        if cls._client is None:
            await cls.init()
        return cls._client

    @classmethod
    async def health_check(cls) -> bool:
        """Check if Redis is healthy.

        Returns:
            True if Redis responds to ping, False otherwise.
        """
        try:
            if cls._client:
                await cls._client.ping()
                return True
        except Exception as e:
            logger.warning("Redis health check failed", extra={"error": str(e)})
        return False

    @classmethod
    async def close(cls) -> None:
        """Close Redis connection."""
        if cls._client:
            await cls._client.close()
            cls._client = None
            cls._initialized = False
            logger.info("Redis connection closed")


async def get_redis() -> redis.Redis:
    """Dependency for getting Redis client."""
    return await RedisManager.get_client()
