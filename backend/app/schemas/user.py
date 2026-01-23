"""User schemas."""
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr, Field

from app.models.user import UserRole
from app.schemas.base import BaseSchema, TimestampSchema, IDSchema


class UserBase(BaseSchema):
    """Base user schema."""
    email: EmailStr
    name: str = Field(min_length=1, max_length=255)
    phone: Optional[str] = Field(None, max_length=50)


class UserCreate(UserBase):
    """Schema for creating a user."""
    password: str = Field(min_length=8, max_length=100)


class UserUpdate(BaseSchema):
    """Schema for updating a user."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    phone: Optional[str] = Field(None, max_length=50)


class UserResponse(UserBase, IDSchema, TimestampSchema):
    """Schema for user response."""
    is_active: bool
    is_verified: bool
    role: UserRole


class UserInDB(UserResponse):
    """Schema for user in database (includes hashed password)."""
    hashed_password: str


# Auth schemas
class Token(BaseSchema):
    """JWT token response."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenPayload(BaseSchema):
    """JWT token payload."""
    sub: UUID
    exp: int
    type: str  # "access" or "refresh"


class LoginRequest(BaseSchema):
    """Login request schema."""
    email: EmailStr
    password: str


class RefreshRequest(BaseSchema):
    """Refresh token request."""
    refresh_token: str
