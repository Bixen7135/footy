"""Base schemas with common configurations."""
from datetime import datetime
from typing import Any, Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict


class BaseSchema(BaseModel):
    """Base schema with common configuration."""
    model_config = ConfigDict(from_attributes=True)


class TimestampSchema(BaseSchema):
    """Schema with timestamp fields."""
    created_at: datetime
    updated_at: datetime


class IDSchema(BaseSchema):
    """Schema with UUID id."""
    id: UUID


class BaseResponse(BaseSchema):
    """Standard API response wrapper."""
    success: bool
    message: str
    data: Optional[Any] = None
