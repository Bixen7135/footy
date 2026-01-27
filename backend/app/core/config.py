"""Application configuration with validation."""
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import model_validator
from functools import lru_cache


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
        extra="ignore",
    )

    # App
    app_name: str = "Footy API"
    debug: bool = False
    environment: str = "development"  # development, staging, production
    api_v1_prefix: str = "/api/v1"

    # Database
    database_url: str = "postgresql+asyncpg://footy:footy@localhost:5432/footy"

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    # JWT - CRITICAL: must be set in production
    secret_key: str = "dev-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7

    # CORS - environment-configurable
    cors_origins: list[str] = ["http://localhost:3000"]

    # Rate limiting
    rate_limit_requests: int = 100
    rate_limit_window_seconds: int = 60
    trust_proxy_headers: bool = False  # Only trust X-Forwarded-For/X-Real-IP when behind known proxy

    # Request limits
    max_request_size_bytes: int = 10 * 1024 * 1024  # 10MB

    @model_validator(mode="after")
    def validate_production_settings(self) -> "Settings":
        """Validate critical settings for production environment."""
        if self.environment == "production":
            # Secret key must not be default
            if self.secret_key == "dev-secret-key-change-in-production":
                raise ValueError(
                    "SECRET_KEY must be set to a secure value in production. "
                    "Generate one with: python -c \"import secrets; print(secrets.token_hex(32))\""
                )

            # Database URL must be explicitly set (not localhost)
            if "localhost" in self.database_url:
                raise ValueError(
                    "DATABASE_URL must not point to localhost in production"
                )

            # Redis URL must be explicitly set (not localhost)
            if "localhost" in self.redis_url:
                raise ValueError(
                    "REDIS_URL must not point to localhost in production"
                )

            # Debug must be off
            if self.debug:
                raise ValueError("DEBUG must be False in production")

        return self

    @property
    def is_production(self) -> bool:
        """Check if running in production environment."""
        return self.environment == "production"

    @property
    def is_development(self) -> bool:
        """Check if running in development environment."""
        return self.environment == "development"


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


settings = get_settings()
