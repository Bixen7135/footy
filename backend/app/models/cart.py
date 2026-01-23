"""Cart and CartItem models."""
import uuid
from typing import TYPE_CHECKING, Optional
from decimal import Decimal
from sqlalchemy import String, Integer, ForeignKey, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base
from app.models.base import TimestampMixin, UUIDMixin

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.product import Product, ProductVariant


class Cart(Base, UUIDMixin, TimestampMixin):
    """Cart model - supports both anonymous and authenticated users."""
    __tablename__ = "carts"

    # For anonymous users
    session_id: Mapped[Optional[str]] = mapped_column(String(255), index=True, nullable=True)

    # For authenticated users
    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=True,
    )

    # Relationships
    user: Mapped[Optional["User"]] = relationship("User", back_populates="cart")
    items: Mapped[list["CartItem"]] = relationship(
        "CartItem",
        back_populates="cart",
        cascade="all, delete-orphan",
    )

    @property
    def total(self) -> Decimal:
        """Calculate cart total."""
        return sum(item.subtotal for item in self.items)

    @property
    def item_count(self) -> int:
        """Get total number of items."""
        return sum(item.quantity for item in self.items)


class CartItem(Base, UUIDMixin, TimestampMixin):
    """Cart item model."""
    __tablename__ = "cart_items"

    cart_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("carts.id", ondelete="CASCADE"),
        nullable=False,
    )

    product_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("products.id", ondelete="CASCADE"),
        nullable=False,
    )

    variant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("product_variants.id", ondelete="CASCADE"),
        nullable=False,
    )

    quantity: Mapped[int] = mapped_column(Integer, default=1, nullable=False)

    # Store price at time of adding (for price change tracking)
    unit_price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)

    # Relationships
    cart: Mapped["Cart"] = relationship("Cart", back_populates="items")
    product: Mapped["Product"] = relationship("Product")
    variant: Mapped["ProductVariant"] = relationship("ProductVariant")

    @property
    def subtotal(self) -> Decimal:
        """Calculate item subtotal."""
        return self.unit_price * self.quantity
