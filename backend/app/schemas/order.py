"""Order schemas."""
from typing import Optional
from uuid import UUID
from decimal import Decimal
from datetime import datetime
from pydantic import Field

from app.models.order import OrderStatus
from app.schemas.base import BaseSchema, TimestampSchema, IDSchema


class ShippingAddress(BaseSchema):
    """Shipping address schema."""
    name: str = Field(min_length=1, max_length=255)
    line1: str = Field(min_length=1, max_length=255)
    line2: Optional[str] = Field(None, max_length=255)
    city: str = Field(min_length=1, max_length=100)
    state: str = Field(min_length=1, max_length=100)
    postal_code: str = Field(min_length=1, max_length=20)
    country: str = Field(min_length=1, max_length=100)
    phone: str = Field(min_length=1, max_length=50)


class OrderItemResponse(IDSchema, TimestampSchema):
    """Schema for order item response."""
    product_id: Optional[UUID] = None
    variant_id: Optional[UUID] = None
    product_name: str
    product_image: Optional[str] = None
    size: str
    quantity: int
    unit_price: Decimal
    subtotal: Decimal


class OrderCreate(BaseSchema):
    """Schema for creating an order."""
    idempotency_key: str = Field(min_length=1, max_length=255)
    shipping_address: ShippingAddress
    notes: Optional[str] = Field(None, max_length=1000)


class OrderResponse(IDSchema, TimestampSchema):
    """Schema for order response."""
    order_number: str
    user_id: UUID
    status: OrderStatus
    subtotal: Decimal
    shipping_cost: Decimal
    tax: Decimal
    total: Decimal
    shipping_address: ShippingAddress
    notes: Optional[str] = None
    items: list[OrderItemResponse] = []


class OrderListResponse(BaseSchema):
    """Schema for paginated order list."""
    items: list[OrderResponse]
    total: int
    page: int
    page_size: int
    pages: int


class OrderStatusUpdate(BaseSchema):
    """Schema for updating order status."""
    status: OrderStatus
