"""Event model for clickstream data."""
import uuid
from enum import Enum
from datetime import datetime
from typing import Optional
from sqlalchemy import String, DateTime, ForeignKey, Enum as SQLEnum, Index
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID, JSONB

from app.db.base import Base
from app.models.base import UUIDMixin


class TrafficSource(str, Enum):
    MOBILE = "MOBILE"
    DESKTOP = "DESKTOP"


class Event(Base, UUIDMixin):
    """Clickstream event model."""
    __tablename__ = "events"

    # Event identification
    event_id: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    event_name: Mapped[str] = mapped_column(String(100), index=True, nullable=False)

    # Session and user linking
    session_id: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )

    # Timing
    event_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    # Source
    traffic_source: Mapped[TrafficSource] = mapped_column(
        SQLEnum(TrafficSource),
        nullable=False,
    )

    # Page context
    page: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    referrer: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    # Flexible metadata (product_id, cart_id, order_id, element_id, etc.)
    event_metadata: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    __table_args__ = (
        Index("ix_events_session_event_time", "session_id", "event_time"),
        Index("ix_events_user_event_time", "user_id", "event_time"),
        Index("ix_events_name_time", "event_name", "event_time"),
    )


class SessionUserMapping(Base, UUIDMixin):
    """Maps anonymous session_id to authenticated user_id."""
    __tablename__ = "session_user_mappings"

    session_id: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    linked_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    __table_args__ = (
        Index("ix_session_user_unique", "session_id", "user_id", unique=True),
    )
