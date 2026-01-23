"""Redis connection management."""
from typing import Optional
import redis.asyncio as redis

from app.core.config import settings


class RedisManager:
    """Manage Redis connection."""

    _client: Optional[redis.Redis] = None

    @classmethod
    async def get_client(cls) -> redis.Redis:
        """Get or create Redis client."""
        if cls._client is None:
            cls._client = redis.from_url(
                settings.redis_url,
                encoding="utf-8",
                decode_responses=True,
            )
        return cls._client

    @classmethod
    async def close(cls) -> None:
        """Close Redis connection."""
        if cls._client:
            await cls._client.close()
            cls._client = None


async def get_redis() -> redis.Redis:
    """Dependency for getting Redis client."""
    return await RedisManager.get_client()
