"""Authentication service - JWT and password handling."""
from datetime import datetime, timedelta, timezone
from typing import Optional
from uuid import UUID

from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.exceptions import (
    AuthenticationError,
    AuthorizationError,
    ConflictError,
    InvalidTokenError,
    NotFoundError,
)
from app.models.user import User, UserRole
from app.schemas.user import (
    UserCreate,
    UserResponse,
    Token,
    TokenPayload,
    LoginRequest,
)


# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    """Service for authentication operations."""

    def __init__(self, db: AsyncSession):
        self.db = db

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash."""
        return pwd_context.verify(plain_password, hashed_password)

    def hash_password(self, password: str) -> str:
        """Hash a password."""
        return pwd_context.hash(password)

    def create_access_token(self, user_id: UUID) -> str:
        """Create an access token for a user."""
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.access_token_expire_minutes
        )
        payload = {
            "sub": str(user_id),
            "exp": expire,
            "type": "access",
        }
        return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)

    def create_refresh_token(self, user_id: UUID) -> str:
        """Create a refresh token for a user."""
        expire = datetime.now(timezone.utc) + timedelta(
            days=settings.refresh_token_expire_days
        )
        payload = {
            "sub": str(user_id),
            "exp": expire,
            "type": "refresh",
        }
        return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)

    def create_tokens(self, user_id: UUID) -> Token:
        """Create both access and refresh tokens."""
        return Token(
            access_token=self.create_access_token(user_id),
            refresh_token=self.create_refresh_token(user_id),
            token_type="bearer",
        )

    def decode_token(self, token: str) -> Optional[TokenPayload]:
        """Decode and validate a JWT token."""
        try:
            payload = jwt.decode(
                token, settings.secret_key, algorithms=[settings.algorithm]
            )
            return TokenPayload(
                sub=UUID(payload["sub"]),
                exp=payload["exp"],
                type=payload["type"],
            )
        except JWTError:
            return None

    async def get_user_by_email(self, email: str) -> Optional[User]:
        """Get a user by email."""
        query = select(User).where(User.email == email.lower())
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_user_by_id(self, user_id: UUID) -> Optional[User]:
        """Get a user by ID."""
        query = select(User).where(User.id == user_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def register(self, user_data: UserCreate) -> tuple[User, Token]:
        """Register a new user."""
        # Check if email already exists
        existing_user = await self.get_user_by_email(user_data.email)
        if existing_user:
            raise ConflictError("Email already registered", "User")

        # Create user
        user = User(
            email=user_data.email.lower(),
            hashed_password=self.hash_password(user_data.password),
            name=user_data.name,
            phone=user_data.phone,
            role=UserRole.USER,
            is_active=True,
            is_verified=False,
        )

        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)

        # Generate tokens
        tokens = self.create_tokens(user.id)

        return user, tokens

    async def login(self, credentials: LoginRequest) -> tuple[User, Token]:
        """Authenticate a user and return tokens."""
        user = await self.get_user_by_email(credentials.email)

        if not user:
            raise AuthenticationError("Invalid email or password")

        if not self.verify_password(credentials.password, user.hashed_password):
            raise AuthenticationError("Invalid email or password")

        if not user.is_active:
            raise AuthorizationError("Account is disabled")

        # Generate tokens
        tokens = self.create_tokens(user.id)

        return user, tokens

    async def refresh_tokens(self, refresh_token: str) -> Token:
        """Refresh access token using refresh token."""
        payload = self.decode_token(refresh_token)

        if not payload:
            raise InvalidTokenError("Invalid refresh token")

        if payload.type != "refresh":
            raise InvalidTokenError("Invalid token type")

        # Check if token is expired
        if datetime.fromtimestamp(payload.exp, tz=timezone.utc) < datetime.now(timezone.utc):
            raise InvalidTokenError("Refresh token expired")

        # Get user
        user = await self.get_user_by_id(payload.sub)
        if not user:
            raise NotFoundError("User", payload.sub)

        if not user.is_active:
            raise AuthorizationError("Account is disabled")

        # Generate new tokens
        return self.create_tokens(user.id)

    async def get_current_user(self, token: str) -> User:
        """Get the current user from an access token."""
        payload = self.decode_token(token)

        if not payload:
            raise InvalidTokenError("Invalid token")

        if payload.type != "access":
            raise InvalidTokenError("Invalid token type")

        # Check if token is expired
        if datetime.fromtimestamp(payload.exp, tz=timezone.utc) < datetime.now(timezone.utc):
            raise InvalidTokenError("Token expired")

        user = await self.get_user_by_id(payload.sub)
        if not user:
            raise NotFoundError("User", payload.sub)

        if not user.is_active:
            raise AuthorizationError("Account is disabled")

        return user
