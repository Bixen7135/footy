"""Wishlist schemas."""
from uuid import UUID
from pydantic import Field

from app.schemas.base import BaseSchema, TimestampSchema, IDSchema
from app.schemas.product import ProductResponse


class WishlistItemCreate(BaseSchema):
    """Schema for adding item to wishlist."""
    product_id: UUID


class WishlistItemResponse(IDSchema, TimestampSchema):
    """Schema for wishlist item response."""
    user_id: UUID
    product_id: UUID
    product: ProductResponse


class WishlistResponse(BaseSchema):
    """Schema for wishlist response."""
    items: list[WishlistItemResponse] = []
    total: int = 0
