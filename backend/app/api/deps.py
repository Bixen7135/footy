"""
Common dependencies for API endpoints.
"""
from typing import Annotated, Optional

from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.base import get_db
from app.models.user import User, UserRole
from app.services.auth_service import AuthService

# Database session dependency
DbSession = Annotated[AsyncSession, Depends(get_db)]

# Security scheme
bearer_scheme = HTTPBearer(auto_error=False)


async def get_auth_service(db: DbSession) -> AuthService:
    """Get auth service instance."""
    return AuthService(db)


async def get_current_user(
    db: DbSession,
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> User:
    """
    Get current authenticated user from JWT token.
    Raises 401 if not authenticated.
    """
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")

    auth_service = AuthService(db)
    try:
        return await auth_service.get_current_user(credentials.credentials)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))


async def get_current_user_optional(
    db: DbSession,
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> Optional[User]:
    """
    Get current user if authenticated, None otherwise.
    Does not raise error for unauthenticated requests.
    """
    if not credentials:
        return None

    auth_service = AuthService(db)
    try:
        return await auth_service.get_current_user(credentials.credentials)
    except ValueError:
        return None


async def get_admin_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Get current user and verify they have admin role.
    Raises 403 if user is not an admin.
    """
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


# Type aliases for dependencies
CurrentUser = Annotated[User, Depends(get_current_user)]
CurrentUserOptional = Annotated[Optional[User], Depends(get_current_user_optional)]
AdminUser = Annotated[User, Depends(get_admin_user)]
