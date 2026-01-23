"""Order and OrderItem models."""
import uuid
from enum import Enum
from decimal import Decimal
from typing import TYPE_CHECKING, Optional
from sqlalchemy import String, Integer, ForeignKey, Numeric, Text, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB

from app.db.base import Base
from app.models.base import TimestampMixin, UUIDMixin

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.product import Product, ProductVariant


class OrderStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class Order(Base, UUIDMixin, TimestampMixin):
    """Order model."""
    __tablename__ = "orders"

    # Order number for display (human-readable)
    order_number: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)

    # Idempotency key to prevent duplicate orders
    idempotency_key: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)

    # User and session linking
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )
    session_id: Mapped[str] = mapped_column(String(255), index=True, nullable=False)

    # Status
    status: Mapped[OrderStatus] = mapped_column(
        SQLEnum(OrderStatus),
        default=OrderStatus.PENDING,
        nullable=False,
    )

    # Pricing
    subtotal: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    shipping_cost: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=Decimal("0.00"), nullable=False)
    tax: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=Decimal("0.00"), nullable=False)
    total: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)

    # Shipping address (stored as JSON for flexibility)
    shipping_address: Mapped[dict] = mapped_column(JSONB, nullable=False)

    # Notes
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="orders")
    items: Mapped[list["OrderItem"]] = relationship(
        "OrderItem",
        back_populates="order",
        cascade="all, delete-orphan",
    )


class OrderItem(Base, UUIDMixin, TimestampMixin):
    """Order item model - snapshot of product at time of order."""
    __tablename__ = "order_items"

    order_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("orders.id", ondelete="CASCADE"),
        nullable=False,
    )

    # Reference to original product (may be null if product deleted)
    product_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("products.id", ondelete="SET NULL"),
        nullable=True,
    )

    variant_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("product_variants.id", ondelete="SET NULL"),
        nullable=True,
    )

    # Snapshot of product info at time of order
    product_name: Mapped[str] = mapped_column(String(255), nullable=False)
    product_image: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    size: Mapped[str] = mapped_column(String(20), nullable=False)

    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    unit_price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)

    # Relationships
    order: Mapped["Order"] = relationship("Order", back_populates="items")
    product: Mapped[Optional["Product"]] = relationship("Product")
    variant: Mapped[Optional["ProductVariant"]] = relationship("ProductVariant")

    @property
    def subtotal(self) -> Decimal:
        """Calculate item subtotal."""
        return self.unit_price * self.quantity
