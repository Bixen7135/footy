"""Admin order management endpoints."""
from uuid import UUID
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import DbSession, AdminUser
from app.models import Order, OrderItem
from app.models.order import OrderStatus
from app.schemas.order import OrderResponse, OrderItemResponse, ShippingAddress

router = APIRouter(prefix="/orders", tags=["admin-orders"])


class OrderStatusUpdate(BaseModel):
    """Schema for updating order status."""
    status: OrderStatus


class OrderListResponse(BaseModel):
    """Paginated order list response."""
    items: list[OrderResponse]
    total: int
    page: int
    page_size: int
    pages: int


def order_to_response(order: Order) -> OrderResponse:
    """Convert order model to response."""
    return OrderResponse(
        id=order.id,
        order_number=order.order_number,
        user_id=order.user_id,
        status=order.status,
        subtotal=order.subtotal,
        shipping_cost=order.shipping_cost,
        tax=order.tax,
        total=order.total,
        shipping_address=ShippingAddress(**order.shipping_address),
        notes=order.notes,
        items=[
            OrderItemResponse(
                id=item.id,
                product_id=item.product_id,
                variant_id=item.variant_id,
                product_name=item.product_name,
                product_image=item.product_image,
                size=item.size,
                quantity=item.quantity,
                unit_price=item.unit_price,
                subtotal=item.subtotal,
                created_at=item.created_at,
                updated_at=item.updated_at,
            )
            for item in order.items
        ],
        created_at=order.created_at,
        updated_at=order.updated_at,
    )


@router.get("", response_model=OrderListResponse)
async def list_orders(
    admin: AdminUser,
    db: DbSession,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: Optional[OrderStatus] = None,
    search: Optional[str] = None,
):
    """
    List all orders with pagination.

    - **status**: Filter by order status
    - **search**: Search by order number
    """
    # Count query
    count_query = select(func.count(Order.id))
    if status:
        count_query = count_query.where(Order.status == status)
    if search:
        count_query = count_query.where(Order.order_number.ilike(f"%{search}%"))

    count_result = await db.execute(count_query)
    total = count_result.scalar()

    pages = (total + page_size - 1) // page_size if total > 0 else 1
    offset = (page - 1) * page_size

    # Orders query
    query = (
        select(Order)
        .options(selectinload(Order.items))
        .order_by(Order.created_at.desc())
        .offset(offset)
        .limit(page_size)
    )
    if status:
        query = query.where(Order.status == status)
    if search:
        query = query.where(Order.order_number.ilike(f"%{search}%"))

    result = await db.execute(query)
    orders = result.scalars().all()

    return OrderListResponse(
        items=[order_to_response(o) for o in orders],
        total=total,
        page=page,
        page_size=page_size,
        pages=pages,
    )


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: UUID,
    admin: AdminUser,
    db: DbSession,
):
    """Get order details by ID."""
    result = await db.execute(
        select(Order)
        .options(selectinload(Order.items))
        .where(Order.id == order_id)
    )
    order = result.scalar_one_or_none()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    return order_to_response(order)


@router.patch("/{order_id}/status", response_model=OrderResponse)
async def update_order_status(
    order_id: UUID,
    status_update: OrderStatusUpdate,
    admin: AdminUser,
    db: DbSession,
):
    """
    Update order status.

    Valid status transitions:
    - pending -> confirmed, cancelled
    - confirmed -> processing, cancelled
    - processing -> shipped, cancelled
    - shipped -> delivered
    - delivered -> (final state)
    - cancelled -> (final state)
    """
    result = await db.execute(
        select(Order)
        .options(selectinload(Order.items))
        .where(Order.id == order_id)
    )
    order = result.scalar_one_or_none()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Validate status transition
    current = order.status
    new = status_update.status

    valid_transitions = {
        OrderStatus.PENDING: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
        OrderStatus.CONFIRMED: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
        OrderStatus.PROCESSING: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
        OrderStatus.SHIPPED: [OrderStatus.DELIVERED],
        OrderStatus.DELIVERED: [],  # Final state
        OrderStatus.CANCELLED: [],  # Final state
    }

    if new not in valid_transitions.get(current, []):
        raise HTTPException(
            status_code=400,
            detail=f"Cannot transition from {current.value} to {new.value}"
        )

    order.status = new
    await db.commit()
    await db.refresh(order)

    return order_to_response(order)


@router.get("/stats/summary", response_model=dict)
async def get_order_stats(
    admin: AdminUser,
    db: DbSession,
):
    """Get order statistics summary."""
    # Total orders by status
    status_counts = {}
    for status in OrderStatus:
        count_result = await db.execute(
            select(func.count(Order.id)).where(Order.status == status)
        )
        status_counts[status.value] = count_result.scalar()

    # Total revenue
    revenue_result = await db.execute(
        select(func.sum(Order.total)).where(
            Order.status.notin_([OrderStatus.CANCELLED])
        )
    )
    total_revenue = revenue_result.scalar() or 0

    # Recent orders count (last 7 days)
    from datetime import datetime, timedelta
    week_ago = datetime.utcnow() - timedelta(days=7)
    recent_result = await db.execute(
        select(func.count(Order.id)).where(Order.created_at >= week_ago)
    )
    recent_orders = recent_result.scalar()

    return {
        "orders_by_status": status_counts,
        "total_revenue": float(total_revenue),
        "recent_orders_7d": recent_orders,
        "total_orders": sum(status_counts.values()),
    }
