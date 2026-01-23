"""Users API endpoints."""
from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import DbSession, CurrentUser
from app.schemas.user import UserResponse, UserUpdate
from app.models.user import User

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(current_user: CurrentUser):
    """
    Get the current authenticated user's profile.

    Requires authentication.
    """
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        phone=current_user.phone,
        is_active=current_user.is_active,
        is_verified=current_user.is_verified,
        role=current_user.role,
        created_at=current_user.created_at,
        updated_at=current_user.updated_at,
    )


@router.patch("/me", response_model=UserResponse)
async def update_current_user_profile(
    update_data: UserUpdate,
    current_user: CurrentUser,
    db: DbSession,
):
    """
    Update the current authenticated user's profile.

    - **name**: New display name (optional)
    - **phone**: New phone number (optional)

    Requires authentication.
    """
    # Update fields if provided
    if update_data.name is not None:
        current_user.name = update_data.name

    if update_data.phone is not None:
        current_user.phone = update_data.phone

    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)

    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        phone=current_user.phone,
        is_active=current_user.is_active,
        is_verified=current_user.is_verified,
        role=current_user.role,
        created_at=current_user.created_at,
        updated_at=current_user.updated_at,
    )
