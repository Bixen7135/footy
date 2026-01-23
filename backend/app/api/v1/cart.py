"""Cart API endpoints."""
from uuid import UUID
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request, Response
import redis.asyncio as redis

from app.api.deps import DbSession
from app.core.session import get_or_create_session_id, get_session_id
from app.core.redis import get_redis
from app.schemas import CartResponse, CartItemCreate, CartItemUpdate
from app.services.cart_service import CartService

router = APIRouter(prefix="/cart", tags=["cart"])


async def get_cart_service(
    db: DbSession,
    redis_client: redis.Redis = Depends(get_redis),
) -> CartService:
    """Dependency for cart service."""
    return CartService(db, redis_client)


@router.get("", response_model=CartResponse)
async def get_cart(
    request: Request,
    response: Response,
    cart_service: CartService = Depends(get_cart_service),
):
    """
    Get the current cart.

    Creates a new session if one doesn't exist.
    Returns cart with enriched product data.
    """
    session_id = get_or_create_session_id(request, response)
    # TODO: Get user_id from auth in Batch 4
    user_id = None

    return await cart_service.get_cart(session_id, user_id)


@router.post("/items", response_model=CartResponse)
async def add_to_cart(
    item: CartItemCreate,
    request: Request,
    response: Response,
    cart_service: CartService = Depends(get_cart_service),
):
    """
    Add an item to the cart.

    - **product_id**: UUID of the product
    - **variant_id**: UUID of the specific size variant
    - **quantity**: Number of items to add (default: 1)

    If the item already exists in cart, quantity is added to existing.
    """
    session_id = get_or_create_session_id(request, response)
    user_id = None

    try:
        return await cart_service.add_item(session_id, item, user_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.patch("/items/{variant_id}", response_model=CartResponse)
async def update_cart_item(
    variant_id: UUID,
    update: CartItemUpdate,
    request: Request,
    response: Response,
    cart_service: CartService = Depends(get_cart_service),
):
    """
    Update quantity of a cart item.

    - **variant_id**: UUID of the variant to update
    - **quantity**: New quantity (0 removes the item)
    """
    session_id = get_session_id(request)
    if not session_id:
        raise HTTPException(status_code=400, detail="No cart found")

    user_id = None

    try:
        return await cart_service.update_item(session_id, variant_id, update, user_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/items/{variant_id}", response_model=CartResponse)
async def remove_from_cart(
    variant_id: UUID,
    request: Request,
    response: Response,
    cart_service: CartService = Depends(get_cart_service),
):
    """
    Remove an item from the cart.

    - **variant_id**: UUID of the variant to remove
    """
    session_id = get_session_id(request)
    if not session_id:
        raise HTTPException(status_code=400, detail="No cart found")

    user_id = None

    try:
        return await cart_service.remove_item(session_id, variant_id, user_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("", status_code=204)
async def clear_cart(
    request: Request,
    cart_service: CartService = Depends(get_cart_service),
):
    """Clear all items from the cart."""
    session_id = get_session_id(request)
    if not session_id:
        return

    await cart_service.clear_cart(session_id)
