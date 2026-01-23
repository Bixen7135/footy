"""Models package - exports all SQLAlchemy models."""
from app.models.base import TimestampMixin, UUIDMixin
from app.models.user import User, UserRole
from app.models.category import Category
from app.models.product import Product, ProductVariant
from app.models.cart import Cart, CartItem
from app.models.order import Order, OrderItem, OrderStatus
from app.models.event import Event, SessionUserMapping, TrafficSource
from app.models.wishlist import WishlistItem

__all__ = [
    # Mixins
    "TimestampMixin",
    "UUIDMixin",
    # User
    "User",
    "UserRole",
    # Catalog
    "Category",
    "Product",
    "ProductVariant",
    # Cart
    "Cart",
    "CartItem",
    # Orders
    "Order",
    "OrderItem",
    "OrderStatus",
    # Events
    "Event",
    "SessionUserMapping",
    "TrafficSource",
    # Wishlist
    "WishlistItem",
]
