"""Event service - business logic for clickstream events."""
from uuid import UUID
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import select, and_
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.event import Event, SessionUserMapping
from app.schemas.event import EventCreate, EventBatchCreate, EventBatchResponse


class EventService:
    """Service for clickstream event operations."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_batch(
        self,
        batch: EventBatchCreate,
        user_id: Optional[UUID] = None,
    ) -> EventBatchResponse:
        """
        Create a batch of events with deduplication.

        Events are deduplicated based on event_id.
        If user_id is provided, it's attached to all events and identity linking is created.
        """
        created = 0
        duplicates = 0
        errors = 0

        # Get existing event_ids to check for duplicates
        event_ids = [e.event_id for e in batch.events]
        existing_query = select(Event.event_id).where(Event.event_id.in_(event_ids))
        result = await self.db.execute(existing_query)
        existing_ids = set(row[0] for row in result.fetchall())

        # Track session_ids for identity linking
        session_ids = set()

        for event_data in batch.events:
            # Skip duplicates
            if event_data.event_id in existing_ids:
                duplicates += 1
                continue

            try:
                event = Event(
                    event_id=event_data.event_id,
                    event_name=event_data.event_name,
                    session_id=event_data.session_id,
                    user_id=user_id,
                    event_time=event_data.event_time,
                    traffic_source=event_data.traffic_source,
                    page=event_data.page,
                    referrer=event_data.referrer,
                    event_metadata=event_data.event_metadata,
                )
                self.db.add(event)
                created += 1
                session_ids.add(event_data.session_id)

            except Exception:
                errors += 1

        # Commit events
        if created > 0:
            await self.db.commit()

        # Create identity linking if user is authenticated
        if user_id and session_ids:
            await self._link_sessions_to_user(session_ids, user_id)

        return EventBatchResponse(
            created=created,
            duplicates=duplicates,
            errors=errors,
        )

    async def _link_sessions_to_user(
        self,
        session_ids: set[str],
        user_id: UUID,
    ) -> None:
        """
        Create session-user mappings for identity linking.

        Also updates existing events from these sessions with the user_id.
        """
        now = datetime.now(timezone.utc)

        for session_id in session_ids:
            # Check if mapping already exists
            existing_query = select(SessionUserMapping).where(
                and_(
                    SessionUserMapping.session_id == session_id,
                    SessionUserMapping.user_id == user_id,
                )
            )
            result = await self.db.execute(existing_query)
            existing = result.scalar_one_or_none()

            if not existing:
                # Create new mapping
                mapping = SessionUserMapping(
                    session_id=session_id,
                    user_id=user_id,
                    linked_at=now,
                )
                self.db.add(mapping)

        await self.db.commit()

        # Update historical events from these sessions with user_id
        # This links past anonymous events to the now-authenticated user
        for session_id in session_ids:
            await self.db.execute(
                Event.__table__.update()
                .where(
                    and_(
                        Event.session_id == session_id,
                        Event.user_id.is_(None),
                    )
                )
                .values(user_id=user_id)
            )

        await self.db.commit()

    async def link_session_to_user(
        self,
        session_id: str,
        user_id: UUID,
    ) -> None:
        """
        Link a session to a user (called on login/register).

        Creates the session-user mapping and updates historical events.
        """
        await self._link_sessions_to_user({session_id}, user_id)

    async def get_user_events(
        self,
        user_id: UUID,
        limit: int = 100,
        offset: int = 0,
    ) -> list[Event]:
        """Get events for a specific user."""
        query = (
            select(Event)
            .where(Event.user_id == user_id)
            .order_by(Event.event_time.desc())
            .limit(limit)
            .offset(offset)
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_session_events(
        self,
        session_id: str,
        limit: int = 100,
        offset: int = 0,
    ) -> list[Event]:
        """Get events for a specific session."""
        query = (
            select(Event)
            .where(Event.session_id == session_id)
            .order_by(Event.event_time.desc())
            .limit(limit)
            .offset(offset)
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())
