"""Health check endpoints."""
from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime
from sqlalchemy import text

from app.db.base import engine
from app.core.redis import RedisManager
from app.core.logging import get_logger

logger = get_logger(__name__)

router = APIRouter(tags=["health"])


class HealthResponse(BaseModel):
    status: str
    timestamp: str
    version: str


class DetailedHealthResponse(BaseModel):
    status: str
    timestamp: str
    version: str
    database: str
    redis: str


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Basic health check endpoint."""
    return HealthResponse(
        status="healthy",
        timestamp=datetime.utcnow().isoformat(),
        version="0.1.0",
    )


@router.get("/health/detailed", response_model=DetailedHealthResponse)
async def detailed_health_check():
    """Detailed health check including database and Redis status."""
    # Check database
    db_status = "healthy"
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
    except Exception as e:
        logger.warning("Database health check failed", extra={"error": str(e)})
        db_status = "unhealthy"

    # Check Redis
    redis_healthy = await RedisManager.health_check()
    redis_status = "healthy" if redis_healthy else "unhealthy"

    # Determine overall status
    if db_status == "healthy" and redis_status == "healthy":
        overall = "healthy"
    elif db_status == "unhealthy" and redis_status == "unhealthy":
        overall = "unhealthy"
    else:
        overall = "degraded"

    return DetailedHealthResponse(
        status=overall,
        timestamp=datetime.utcnow().isoformat(),
        version="0.1.0",
        database=db_status,
        redis=redis_status,
    )
