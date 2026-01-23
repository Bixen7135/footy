"""Product schemas."""
from typing import Optional
from uuid import UUID
from decimal import Decimal
from pydantic import Field

from app.schemas.base import BaseSchema, TimestampSchema, IDSchema
from app.schemas.category import CategoryResponse


class ProductVariantBase(BaseSchema):
    """Base product variant schema."""
    size: str = Field(min_length=1, max_length=20)
    sku: Optional[str] = Field(None, max_length=100)
    stock: int = Field(ge=0, default=0)


class ProductVariantCreate(ProductVariantBase):
    """Schema for creating a product variant."""
    pass


class ProductVariantUpdate(BaseSchema):
    """Schema for updating a product variant."""
    size: Optional[str] = Field(None, min_length=1, max_length=20)
    sku: Optional[str] = Field(None, max_length=100)
    stock: Optional[int] = Field(None, ge=0)


class ProductVariantResponse(ProductVariantBase, IDSchema, TimestampSchema):
    """Schema for product variant response."""
    product_id: UUID


class ProductBase(BaseSchema):
    """Base product schema."""
    name: str = Field(min_length=1, max_length=255)
    slug: str = Field(min_length=1, max_length=255)
    description: Optional[str] = None
    price: Decimal = Field(ge=0, decimal_places=2)
    compare_at_price: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    images: list[str] = []
    brand: Optional[str] = Field(None, max_length=100)
    material: Optional[str] = Field(None, max_length=100)
    color: Optional[str] = Field(None, max_length=50)
    gender: Optional[str] = Field(None, max_length=20)
    is_active: bool = True
    is_featured: bool = False
    category_id: Optional[UUID] = None
    meta_title: Optional[str] = Field(None, max_length=255)
    meta_description: Optional[str] = Field(None, max_length=500)


class ProductCreate(ProductBase):
    """Schema for creating a product."""
    variants: list[ProductVariantCreate] = []


class ProductUpdate(BaseSchema):
    """Schema for updating a product."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    slug: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    price: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    compare_at_price: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    images: Optional[list[str]] = None
    brand: Optional[str] = Field(None, max_length=100)
    material: Optional[str] = Field(None, max_length=100)
    color: Optional[str] = Field(None, max_length=50)
    gender: Optional[str] = Field(None, max_length=20)
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None
    category_id: Optional[UUID] = None
    meta_title: Optional[str] = Field(None, max_length=255)
    meta_description: Optional[str] = Field(None, max_length=500)


class ProductResponse(ProductBase, IDSchema, TimestampSchema):
    """Schema for product response."""
    variants: list[ProductVariantResponse] = []
    category: Optional[CategoryResponse] = None
    in_stock: bool = True
    available_sizes: list[str] = []


class ProductListResponse(BaseSchema):
    """Schema for paginated product list."""
    items: list[ProductResponse]
    total: int
    page: int
    page_size: int
    pages: int


# Filters
class ProductFilters(BaseSchema):
    """Product filter parameters."""
    category_id: Optional[UUID] = None
    category_slug: Optional[str] = None
    brand: Optional[str] = None
    color: Optional[str] = None
    gender: Optional[str] = None
    min_price: Optional[Decimal] = None
    max_price: Optional[Decimal] = None
    sizes: Optional[list[str]] = None
    in_stock: Optional[bool] = None
    is_featured: Optional[bool] = None
    search: Optional[str] = None
