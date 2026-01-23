"""Schemas package - exports all Pydantic schemas."""
from app.schemas.base import BaseSchema, TimestampSchema, IDSchema
from app.schemas.user import (
    UserBase, UserCreate, UserUpdate, UserResponse, UserInDB,
    Token, TokenPayload, LoginRequest, RefreshRequest,
)
from app.schemas.category import (
    CategoryBase, CategoryCreate, CategoryUpdate, CategoryResponse, CategoryWithChildren,
)
from app.schemas.product import (
    ProductVariantBase, ProductVariantCreate, ProductVariantUpdate, ProductVariantResponse,
    ProductBase, ProductCreate, ProductUpdate, ProductResponse, ProductListResponse,
    ProductFilters,
)
from app.schemas.cart import (
    CartItemBase, CartItemCreate, CartItemUpdate, CartItemResponse,
    CartResponse,
)
from app.schemas.order import (
    ShippingAddress, OrderItemResponse,
    OrderCreate, OrderResponse, OrderListResponse, OrderStatusUpdate,
)
from app.schemas.event import (
    EventCreate, EventBatchCreate, EventResponse, EventBatchResponse,
)
from app.schemas.wishlist import (
    WishlistItemCreate, WishlistItemResponse, WishlistResponse,
)

__all__ = [
    # Base
    "BaseSchema",
    "TimestampSchema",
    "IDSchema",
    # User
    "UserBase",
    "UserCreate",
    "UserUpdate",
    "UserResponse",
    "UserInDB",
    "Token",
    "TokenPayload",
    "LoginRequest",
    "RefreshRequest",
    # Category
    "CategoryBase",
    "CategoryCreate",
    "CategoryUpdate",
    "CategoryResponse",
    "CategoryWithChildren",
    # Product
    "ProductVariantBase",
    "ProductVariantCreate",
    "ProductVariantUpdate",
    "ProductVariantResponse",
    "ProductBase",
    "ProductCreate",
    "ProductUpdate",
    "ProductResponse",
    "ProductListResponse",
    "ProductFilters",
    # Cart
    "CartItemBase",
    "CartItemCreate",
    "CartItemUpdate",
    "CartItemResponse",
    "CartResponse",
    # Order
    "ShippingAddress",
    "OrderItemResponse",
    "OrderCreate",
    "OrderResponse",
    "OrderListResponse",
    "OrderStatusUpdate",
    # Event
    "EventCreate",
    "EventBatchCreate",
    "EventResponse",
    "EventBatchResponse",
    # Wishlist
    "WishlistItemCreate",
    "WishlistItemResponse",
    "WishlistResponse",
]
