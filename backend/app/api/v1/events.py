"""Events API endpoints for clickstream data."""
from fastapi import APIRouter, Depends, Request, Response

from app.api.deps import DbSession, CurrentUserOptional
from app.core.session import get_or_create_session_id
from app.schemas.event import EventBatchCreate, EventBatchResponse
from app.services.event_service import EventService

router = APIRouter(prefix="/events", tags=["events"])


async def get_event_service(db: DbSession) -> EventService:
    """Dependency for event service."""
    return EventService(db)


@router.post("/batch", response_model=EventBatchResponse)
async def create_event_batch(
    batch: EventBatchCreate,
    request: Request,
    response: Response,
    current_user: CurrentUserOptional,
    event_service: EventService = Depends(get_event_service),
):
    """
    Ingest a batch of clickstream events.

    - **events**: Array of events (max 100 per batch)

    Each event requires:
    - **event_id**: Unique identifier (client-generated, used for deduplication)
    - **event_name**: Event type (e.g., view_item, add_to_cart)
    - **session_id**: Browser session identifier
    - **event_time**: ISO timestamp when event occurred
    - **traffic_source**: MOBILE or DESKTOP
    - **page**: Optional current page URL
    - **referrer**: Optional referrer URL
    - **event_metadata**: Optional JSON with event-specific data

    Deduplication is based on event_id - duplicate events are ignored.
    If authenticated, events are linked to the user and historical anonymous
    events from the same session are also linked.

    Returns count of created, duplicate, and errored events.
    """
    # Ensure session cookie exists
    get_or_create_session_id(request, response)

    user_id = current_user.id if current_user else None

    return await event_service.create_batch(batch, user_id)
