"""Admin product management endpoints."""
from uuid import UUID
from typing import Optional
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import DbSession, AdminUser
from app.models import Product, ProductVariant, Category
from app.schemas.product import ProductResponse, ProductVariantResponse, CategoryResponse

router = APIRouter(prefix="/products", tags=["admin-products"])


# Admin-specific schemas
class ProductCreateAdmin(BaseModel):
    """Schema for admin product creation."""
    name: str = Field(min_length=1, max_length=255)
    slug: str = Field(min_length=1, max_length=255)
    description: Optional[str] = None
    price: float = Field(gt=0)
    compare_at_price: Optional[float] = Field(None, gt=0)
    images: list[str] = []
    brand: Optional[str] = None
    material: Optional[str] = None
    color: Optional[str] = None
    gender: Optional[str] = None
    is_active: bool = True
    is_featured: bool = False
    category_id: Optional[UUID] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None


class ProductUpdateAdmin(BaseModel):
    """Schema for admin product update."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    slug: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    compare_at_price: Optional[float] = Field(None, gt=0)
    images: Optional[list[str]] = None
    brand: Optional[str] = None
    material: Optional[str] = None
    color: Optional[str] = None
    gender: Optional[str] = None
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None
    category_id: Optional[UUID] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None


class VariantCreateAdmin(BaseModel):
    """Schema for admin variant creation."""
    size: str = Field(min_length=1, max_length=20)
    sku: Optional[str] = Field(None, max_length=100)
    stock: int = Field(ge=0, default=0)


class VariantUpdateAdmin(BaseModel):
    """Schema for admin variant update."""
    size: Optional[str] = Field(None, min_length=1, max_length=20)
    sku: Optional[str] = Field(None, max_length=100)
    stock: Optional[int] = Field(None, ge=0)


class ProductListResponse(BaseModel):
    """Paginated product list response."""
    items: list[ProductResponse]
    total: int
    page: int
    page_size: int
    pages: int


def product_to_response(product: Product) -> ProductResponse:
    """Convert product model to response."""
    variants = []
    available_sizes = []
    in_stock = False

    if product.variants:
        for v in product.variants:
            variants.append(ProductVariantResponse(
                id=v.id,
                product_id=v.product_id,
                size=v.size,
                sku=v.sku,
                stock=v.stock,
                created_at=v.created_at,
                updated_at=v.updated_at,
            ))
            if v.stock > 0:
                in_stock = True
                available_sizes.append(v.size)

    category_response = None
    if product.category:
        category_response = CategoryResponse(
            id=product.category.id,
            name=product.category.name,
            slug=product.category.slug,
            description=product.category.description,
            image_url=product.category.image_url,
            parent_id=product.category.parent_id,
            created_at=product.category.created_at,
            updated_at=product.category.updated_at,
        )

    return ProductResponse(
        id=product.id,
        name=product.name,
        slug=product.slug,
        description=product.description,
        price=float(product.price),
        compare_at_price=float(product.compare_at_price) if product.compare_at_price else None,
        images=product.images or [],
        brand=product.brand,
        material=product.material,
        color=product.color,
        gender=product.gender,
        is_active=product.is_active,
        is_featured=product.is_featured,
        category_id=product.category_id,
        category=category_response,
        meta_title=product.meta_title,
        meta_description=product.meta_description,
        created_at=product.created_at,
        updated_at=product.updated_at,
        variants=variants,
        in_stock=in_stock,
        available_sizes=available_sizes,
    )


@router.get("", response_model=ProductListResponse)
async def list_products(
    admin: AdminUser,
    db: DbSession,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    is_active: Optional[bool] = None,
):
    """
    List all products with pagination (admin view includes inactive).
    """
    # Count query
    count_query = select(func.count(Product.id))
    if search:
        count_query = count_query.where(Product.name.ilike(f"%{search}%"))
    if is_active is not None:
        count_query = count_query.where(Product.is_active == is_active)

    count_result = await db.execute(count_query)
    total = count_result.scalar()

    pages = (total + page_size - 1) // page_size if total > 0 else 1
    offset = (page - 1) * page_size

    # Products query
    query = (
        select(Product)
        .options(selectinload(Product.category), selectinload(Product.variants))
        .order_by(Product.created_at.desc())
        .offset(offset)
        .limit(page_size)
    )
    if search:
        query = query.where(Product.name.ilike(f"%{search}%"))
    if is_active is not None:
        query = query.where(Product.is_active == is_active)

    result = await db.execute(query)
    products = result.scalars().all()

    return ProductListResponse(
        items=[product_to_response(p) for p in products],
        total=total,
        page=page,
        page_size=page_size,
        pages=pages,
    )


@router.post("", response_model=ProductResponse, status_code=201)
async def create_product(
    product_data: ProductCreateAdmin,
    admin: AdminUser,
    db: DbSession,
):
    """Create a new product."""
    # Check slug uniqueness
    existing = await db.execute(
        select(Product).where(Product.slug == product_data.slug)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Product with this slug already exists")

    # Validate category if provided
    if product_data.category_id:
        cat_result = await db.execute(
            select(Category).where(Category.id == product_data.category_id)
        )
        if not cat_result.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Category not found")

    product = Product(
        name=product_data.name,
        slug=product_data.slug,
        description=product_data.description,
        price=Decimal(str(product_data.price)),
        compare_at_price=Decimal(str(product_data.compare_at_price)) if product_data.compare_at_price else None,
        images=product_data.images,
        brand=product_data.brand,
        material=product_data.material,
        color=product_data.color,
        gender=product_data.gender,
        is_active=product_data.is_active,
        is_featured=product_data.is_featured,
        category_id=product_data.category_id,
        meta_title=product_data.meta_title,
        meta_description=product_data.meta_description,
    )

    db.add(product)
    await db.commit()
    await db.refresh(product)

    # Reload with relationships
    result = await db.execute(
        select(Product)
        .options(selectinload(Product.category), selectinload(Product.variants))
        .where(Product.id == product.id)
    )
    product = result.scalar_one()

    return product_to_response(product)


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: UUID,
    admin: AdminUser,
    db: DbSession,
):
    """Get a product by ID (admin can see inactive)."""
    result = await db.execute(
        select(Product)
        .options(selectinload(Product.category), selectinload(Product.variants))
        .where(Product.id == product_id)
    )
    product = result.scalar_one_or_none()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return product_to_response(product)


@router.patch("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: UUID,
    update_data: ProductUpdateAdmin,
    admin: AdminUser,
    db: DbSession,
):
    """Update a product."""
    result = await db.execute(
        select(Product)
        .options(selectinload(Product.category), selectinload(Product.variants))
        .where(Product.id == product_id)
    )
    product = result.scalar_one_or_none()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Check slug uniqueness if changed
    if update_data.slug and update_data.slug != product.slug:
        existing = await db.execute(
            select(Product).where(Product.slug == update_data.slug)
        )
        if existing.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Product with this slug already exists")

    # Validate category if changed
    if update_data.category_id:
        cat_result = await db.execute(
            select(Category).where(Category.id == update_data.category_id)
        )
        if not cat_result.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Category not found")

    # Update fields
    update_dict = update_data.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        if field == "price" and value is not None:
            setattr(product, field, Decimal(str(value)))
        elif field == "compare_at_price" and value is not None:
            setattr(product, field, Decimal(str(value)))
        else:
            setattr(product, field, value)

    await db.commit()
    await db.refresh(product)

    return product_to_response(product)


@router.delete("/{product_id}", status_code=204)
async def delete_product(
    product_id: UUID,
    admin: AdminUser,
    db: DbSession,
):
    """Delete a product (soft delete by setting inactive)."""
    result = await db.execute(
        select(Product).where(Product.id == product_id)
    )
    product = result.scalar_one_or_none()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Soft delete
    product.is_active = False
    await db.commit()


# Variant management
@router.post("/{product_id}/variants", response_model=ProductVariantResponse, status_code=201)
async def create_variant(
    product_id: UUID,
    variant_data: VariantCreateAdmin,
    admin: AdminUser,
    db: DbSession,
):
    """Add a variant to a product."""
    result = await db.execute(
        select(Product).where(Product.id == product_id)
    )
    product = result.scalar_one_or_none()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Check for duplicate size
    existing = await db.execute(
        select(ProductVariant).where(
            ProductVariant.product_id == product_id,
            ProductVariant.size == variant_data.size,
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Variant with this size already exists")

    variant = ProductVariant(
        product_id=product_id,
        size=variant_data.size,
        sku=variant_data.sku,
        stock=variant_data.stock,
    )

    db.add(variant)
    await db.commit()
    await db.refresh(variant)

    return ProductVariantResponse(
        id=variant.id,
        product_id=variant.product_id,
        size=variant.size,
        sku=variant.sku,
        stock=variant.stock,
        created_at=variant.created_at,
        updated_at=variant.updated_at,
    )


@router.patch("/{product_id}/variants/{variant_id}", response_model=ProductVariantResponse)
async def update_variant(
    product_id: UUID,
    variant_id: UUID,
    update_data: VariantUpdateAdmin,
    admin: AdminUser,
    db: DbSession,
):
    """Update a product variant."""
    result = await db.execute(
        select(ProductVariant).where(
            ProductVariant.id == variant_id,
            ProductVariant.product_id == product_id,
        )
    )
    variant = result.scalar_one_or_none()

    if not variant:
        raise HTTPException(status_code=404, detail="Variant not found")

    update_dict = update_data.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(variant, field, value)

    await db.commit()
    await db.refresh(variant)

    return ProductVariantResponse(
        id=variant.id,
        product_id=variant.product_id,
        size=variant.size,
        sku=variant.sku,
        stock=variant.stock,
        created_at=variant.created_at,
        updated_at=variant.updated_at,
    )


@router.delete("/{product_id}/variants/{variant_id}", status_code=204)
async def delete_variant(
    product_id: UUID,
    variant_id: UUID,
    admin: AdminUser,
    db: DbSession,
):
    """Delete a product variant."""
    result = await db.execute(
        select(ProductVariant).where(
            ProductVariant.id == variant_id,
            ProductVariant.product_id == product_id,
        )
    )
    variant = result.scalar_one_or_none()

    if not variant:
        raise HTTPException(status_code=404, detail="Variant not found")

    await db.delete(variant)
    await db.commit()
