"""User model."""
import uuid
from enum import Enum
from typing import TYPE_CHECKING, Optional
from sqlalchemy import String, Boolean, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base
from app.models.base import TimestampMixin, UUIDMixin

if TYPE_CHECKING:
    from app.models.order import Order
    from app.models.cart import Cart
    from app.models.wishlist import WishlistItem


class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"


class User(Base, UUIDMixin, TimestampMixin):
    """User model for authentication and profile."""
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)

    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    role: Mapped[UserRole] = mapped_column(
        SQLEnum(UserRole),
        default=UserRole.USER,
        nullable=False,
    )

    # Relationships
    orders: Mapped[list["Order"]] = relationship("Order", back_populates="user")
    cart: Mapped[Optional["Cart"]] = relationship("Cart", back_populates="user", uselist=False)
    wishlist_items: Mapped[list["WishlistItem"]] = relationship("WishlistItem", back_populates="user")
