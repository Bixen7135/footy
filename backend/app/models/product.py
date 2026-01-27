"""Product and ProductVariant models."""
import uuid
from decimal import Decimal
from typing import TYPE_CHECKING, Optional
from sqlalchemy import String, Text, Numeric, Integer, Boolean, ForeignKey, ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB

from app.db.base import Base
from app.models.base import TimestampMixin, UUIDMixin

if TYPE_CHECKING:
    from app.models.category import Category


class Product(Base, UUIDMixin, TimestampMixin):
    """Product model."""
    __tablename__ = "products"

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Pricing
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    compare_at_price: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 2), nullable=True)

    # Media
    images: Mapped[list[str]] = mapped_column(ARRAY(String), default=list, nullable=False)

    # Footwear-specific
    brand: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    material: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    color: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    gender: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)  # men, women, unisex, kids

    # Status
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Category
    category_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("categories.id"),
        nullable=True,
    )

    # SEO and metadata
    meta_title: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    meta_description: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    # Relationships
    category: Mapped[Optional["Category"]] = relationship("Category", back_populates="products")
    variants: Mapped[list["ProductVariant"]] = relationship(
        "ProductVariant",
        back_populates="product",
        cascade="all, delete-orphan",
    )

    @property
    def in_stock(self) -> bool:
        """Check if any variant is in stock."""
        return any(v.stock > 0 for v in self.variants)

    @property
    def available_sizes(self) -> list[str]:
        """Get list of available sizes."""
        return [v.size for v in self.variants if v.stock > 0]


class ProductVariant(Base, UUIDMixin, TimestampMixin):
    """Product variant model for size/stock management."""
    __tablename__ = "product_variants"

    product_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("products.id", ondelete="CASCADE"),
        nullable=False,
    )

    size: Mapped[str] = mapped_column(String(20), nullable=False)
    sku: Mapped[Optional[str]] = mapped_column(String(100), unique=True, nullable=True)
    stock: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Optimistic locking version for concurrent stock updates
    version: Mapped[int] = mapped_column(Integer, default=1, nullable=False)

    # Relationships
    product: Mapped["Product"] = relationship("Product", back_populates="variants")

    # Enable optimistic locking using the version field
    __mapper_args__ = {
        "version_id_col": version
    }
