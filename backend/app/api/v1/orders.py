"""Orders API endpoints."""
from uuid import UUID
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request, Response, Query
import redis.asyncio as redis

from app.api.deps import DbSession, CurrentUser
from app.core.session import get_session_id, get_or_create_session_id
from app.core.redis import get_redis
from app.schemas.order import OrderCreate, OrderResponse, OrderListResponse
from app.services.order_service import OrderService

router = APIRouter(prefix="/orders", tags=["orders"])


async def get_order_service(
    db: DbSession,
    redis_client: redis.Redis = Depends(get_redis),
) -> OrderService:
    """Dependency for order service."""
    return OrderService(db, redis_client)


@router.post("", response_model=OrderResponse, status_code=201)
async def create_order(
    order_data: OrderCreate,
    request: Request,
    response: Response,
    current_user: CurrentUser,
    order_service: OrderService = Depends(get_order_service),
):
    """
    Create a new order from the current cart.

    Requires authentication. Uses idempotency key to prevent duplicate orders.

    - **idempotency_key**: Unique key to prevent duplicate orders (client-generated UUID)
    - **shipping_address**: Delivery address
    - **notes**: Optional order notes

    The cart is cleared after successful order creation.
    Stock is validated and reserved during order creation.
    """
    session_id = get_or_create_session_id(request, response)

    order = await order_service.create_order(
        order_data=order_data,
        user_id=current_user.id,
        session_id=session_id,
    )
    return order


@router.get("", response_model=OrderListResponse)
async def list_orders(
    current_user: CurrentUser,
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
    order_service: OrderService = Depends(get_order_service),
):
    """
    List all orders for the current user.

    Requires authentication. Returns paginated list of orders sorted by date (newest first).
    """
    return await order_service.list_user_orders(
        user_id=current_user.id,
        page=page,
        page_size=page_size,
    )


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: UUID,
    current_user: CurrentUser,
    order_service: OrderService = Depends(get_order_service),
):
    """
    Get a specific order by ID.

    Requires authentication. Users can only access their own orders.
    """
    order = await order_service.get_order(order_id, current_user.id)

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    return order


@router.get("/number/{order_number}", response_model=OrderResponse)
async def get_order_by_number(
    order_number: str,
    current_user: CurrentUser,
    order_service: OrderService = Depends(get_order_service),
):
    """
    Get a specific order by order number.

    Requires authentication. Users can only access their own orders.
    """
    order = await order_service.get_order_by_number(order_number, current_user.id)

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    return order
