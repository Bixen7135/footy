"""Event schemas."""
from typing import Optional, Any
from uuid import UUID
from datetime import datetime
from pydantic import Field

from app.models.event import TrafficSource
from app.schemas.base import BaseSchema, IDSchema


class EventCreate(BaseSchema):
    """Schema for creating an event."""
    event_id: str = Field(min_length=1, max_length=255)
    event_name: str = Field(min_length=1, max_length=100)
    session_id: str = Field(min_length=1, max_length=255)
    event_time: datetime
    traffic_source: TrafficSource
    page: Optional[str] = Field(None, max_length=500)
    referrer: Optional[str] = Field(None, max_length=500)
    event_metadata: Optional[dict[str, Any]] = None


class EventBatchCreate(BaseSchema):
    """Schema for creating multiple events."""
    events: list[EventCreate] = Field(min_length=1, max_length=100)


class EventResponse(IDSchema):
    """Schema for event response."""
    event_id: str
    event_name: str
    session_id: str
    user_id: Optional[UUID] = None
    event_time: datetime
    traffic_source: TrafficSource
    page: Optional[str] = None
    referrer: Optional[str] = None
    event_metadata: Optional[dict[str, Any]] = None


class EventBatchResponse(BaseSchema):
    """Schema for batch event creation response."""
    created: int
    duplicates: int
    errors: int
