"""Cart schemas."""
from typing import Optional
from uuid import UUID
from decimal import Decimal
from pydantic import Field

from app.schemas.base import BaseSchema, TimestampSchema, IDSchema
from app.schemas.product import ProductResponse, ProductVariantResponse


class CartItemBase(BaseSchema):
    """Base cart item schema."""
    product_id: UUID
    variant_id: UUID
    quantity: int = Field(ge=1, default=1)


class CartItemCreate(CartItemBase):
    """Schema for adding item to cart."""
    pass


class CartItemUpdate(BaseSchema):
    """Schema for updating cart item."""
    quantity: int = Field(ge=1)


class CartItemResponse(IDSchema, TimestampSchema):
    """Schema for cart item response."""
    product_id: UUID
    variant_id: UUID
    quantity: int
    unit_price: Decimal
    subtotal: Decimal
    product: ProductResponse
    variant: ProductVariantResponse


class CartResponse(IDSchema, TimestampSchema):
    """Schema for cart response."""
    session_id: Optional[str] = None
    user_id: Optional[UUID] = None
    items: list[CartItemResponse] = []
    total: Decimal = Decimal("0.00")
    item_count: int = 0
