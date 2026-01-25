"""Authentication API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, Request, Response
import redis.asyncio as redis

from app.api.deps import DbSession
from app.core.session import get_or_create_session_id
from app.core.redis import get_redis
from app.schemas.user import (
    UserCreate,
    UserResponse,
    Token,
    LoginRequest,
    RefreshRequest,
)
from app.services.auth_service import AuthService
from app.services.cart_service import CartService
from app.services.event_service import EventService

router = APIRouter(prefix="/auth", tags=["auth"])


async def get_auth_service(db: DbSession) -> AuthService:
    """Dependency for auth service."""
    return AuthService(db)


async def get_cart_service(
    db: DbSession,
    redis_client: redis.Redis = Depends(get_redis),
) -> CartService:
    """Dependency for cart service."""
    return CartService(db, redis_client)


async def get_event_service(db: DbSession) -> EventService:
    """Dependency for event service."""
    return EventService(db)


class AuthResponse:
    """Response model combining user and tokens."""
    pass


@router.post("/register", response_model=dict)
async def register(
    user_data: UserCreate,
    request: Request,
    response: Response,
    auth_service: AuthService = Depends(get_auth_service),
    cart_service: CartService = Depends(get_cart_service),
    event_service: EventService = Depends(get_event_service),
):
    """
    Register a new user.

    - **email**: Valid email address
    - **password**: At least 8 characters
    - **name**: User's full name
    - **phone**: Optional phone number

    Returns user data and JWT tokens.
    Cart items are preserved and linked to the new user.
    Anonymous clickstream events are linked to the user.
    """
    try:
        user, tokens = await auth_service.register(user_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Get/create session
    session_id = get_or_create_session_id(request, response)

    # Merge cart
    await cart_service.merge_carts(session_id, user.id)

    # Link anonymous events to user (identity linking)
    await event_service.link_session_to_user(session_id, user.id)

    return {
        "user": UserResponse(
            id=user.id,
            email=user.email,
            name=user.name,
            phone=user.phone,
            is_active=user.is_active,
            is_verified=user.is_verified,
            role=user.role,
            created_at=user.created_at,
            updated_at=user.updated_at,
        ),
        "tokens": tokens,
    }


@router.post("/login", response_model=dict)
async def login(
    credentials: LoginRequest,
    request: Request,
    response: Response,
    auth_service: AuthService = Depends(get_auth_service),
    cart_service: CartService = Depends(get_cart_service),
    event_service: EventService = Depends(get_event_service),
):
    """
    Authenticate a user and return tokens.

    - **email**: Registered email address
    - **password**: User's password

    Returns user data and JWT tokens.
    Cart items from anonymous session are merged with user's cart.
    Anonymous clickstream events are linked to the user.
    """
    try:
        user, tokens = await auth_service.login(credentials)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))

    # Get/create session
    session_id = get_or_create_session_id(request, response)

    # Merge cart
    await cart_service.merge_carts(session_id, user.id)

    # Link anonymous events to user (identity linking)
    await event_service.link_session_to_user(session_id, user.id)

    return {
        "user": UserResponse(
            id=user.id,
            email=user.email,
            name=user.name,
            phone=user.phone,
            is_active=user.is_active,
            is_verified=user.is_verified,
            role=user.role,
            created_at=user.created_at,
            updated_at=user.updated_at,
        ),
        "tokens": tokens,
    }


@router.post("/refresh", response_model=Token)
async def refresh_token(
    refresh_data: RefreshRequest,
    auth_service: AuthService = Depends(get_auth_service),
):
    """
    Refresh access token using refresh token.

    - **refresh_token**: Valid refresh token

    Returns new access and refresh tokens.
    """
    try:
        return await auth_service.refresh_tokens(refresh_data.refresh_token)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))


@router.get("/me", response_model=UserResponse)
async def get_current_user(
    request: Request,
    auth_service: AuthService = Depends(get_auth_service),
):
    """
    Get the current authenticated user.

    Requires a valid access token in the Authorization header.
    """
    # Extract token from Authorization header
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = auth_header.split(" ")[1]

    try:
        user = await auth_service.get_current_user(token)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))

    return UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        phone=user.phone,
        is_active=user.is_active,
        is_verified=user.is_verified,
        role=user.role,
        created_at=user.created_at,
        updated_at=user.updated_at,
    )
