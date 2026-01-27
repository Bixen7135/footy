"""Session management for anonymous users."""
import uuid
from typing import Optional

from fastapi import Request, Response

from app.core.config import settings


SESSION_COOKIE_NAME = "footy_session_id"
SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 30  # 30 days


def get_session_id(request: Request) -> Optional[str]:
    """Get session ID from request cookies."""
    return request.cookies.get(SESSION_COOKIE_NAME)


def generate_session_id() -> str:
    """Generate a new session ID."""
    return str(uuid.uuid4())


def set_session_cookie(response: Response, session_id: str) -> None:
    """Set session ID cookie on response."""
    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=session_id,
        max_age=SESSION_COOKIE_MAX_AGE,
        httponly=True,
        samesite="lax",
        secure=settings.is_production,
    )


def get_or_create_session_id(request: Request, response: Response) -> str:
    """Get existing session ID or create a new one."""
    session_id = get_session_id(request)

    if not session_id:
        session_id = generate_session_id()
        set_session_cookie(response, session_id)

    return session_id
