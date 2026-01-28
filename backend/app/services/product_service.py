"""Product service - business logic for products and categories."""
from uuid import UUID
from typing import Optional
from decimal import Decimal

from sqlalchemy import select, func, or_, and_
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Product, ProductVariant, Category
from app.schemas import (
    ProductFilters, ProductResponse, ProductListResponse,
    ProductVariantResponse, CategoryResponse,
)


class ProductService:
    """Service for product-related operations."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_products(
        self,
        filters: Optional[ProductFilters] = None,
        page: int = 1,
        page_size: int = 12,
    ) -> ProductListResponse:
        """Get paginated list of products with optional filters."""
        # Base query with eager loading of variants and category
        query = (
            select(Product)
            .options(
                selectinload(Product.variants),
                selectinload(Product.category),
            )
            .where(Product.is_active == True)
        )

        # Apply filters
        if filters:
            if filters.category_id:
                query = query.where(Product.category_id == filters.category_id)

            if filters.category_slug:
                query = query.join(Category).where(Category.slug == filters.category_slug)

            if filters.brand:
                query = query.where(Product.brand.ilike(f"%{filters.brand}%"))

            if filters.color:
                query = query.where(Product.color.ilike(f"%{filters.color}%"))

            if filters.gender:
                if filters.gender in ("men", "women"):
                    query = query.where(
                        or_(
                            Product.gender == filters.gender,
                            Product.gender == "unisex"
                        )
                    )
                else:
                    query = query.where(Product.gender == filters.gender)

            if filters.min_price is not None:
                query = query.where(Product.price >= filters.min_price)

            if filters.max_price is not None:
                query = query.where(Product.price <= filters.max_price)

            if filters.is_featured:
                query = query.where(Product.is_featured == True)

            if filters.search:
                search_term = f"%{filters.search}%"
                query = query.where(
                    or_(
                        Product.name.ilike(search_term),
                        Product.description.ilike(search_term),
                        Product.brand.ilike(search_term),
                    )
                )

            if filters.sizes:
                # Filter products that have at least one variant with the specified size and stock > 0
                query = query.where(
                    Product.id.in_(
                        select(ProductVariant.product_id)
                        .where(
                            and_(
                                ProductVariant.size.in_(filters.sizes),
                                ProductVariant.stock > 0,
                            )
                        )
                        .distinct()
                    )
                )

            if filters.in_stock:
                # Filter products that have at least one variant with stock > 0
                query = query.where(
                    Product.id.in_(
                        select(ProductVariant.product_id)
                        .where(ProductVariant.stock > 0)
                        .distinct()
                    )
                )

        # Get total count
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self.db.execute(count_query)
        total = total_result.scalar() or 0

        # Apply pagination
        offset = (page - 1) * page_size
        query = query.order_by(Product.created_at.desc()).offset(offset).limit(page_size)

        # Execute query
        result = await self.db.execute(query)
        products = result.scalars().unique().all()

        # Convert to response models
        items = [self._product_to_response(p) for p in products]
        pages = (total + page_size - 1) // page_size if page_size > 0 else 0

        return ProductListResponse(
            items=items,
            total=total,
            page=page,
            page_size=page_size,
            pages=pages,
        )

    async def get_product_by_id(self, product_id: UUID) -> Optional[ProductResponse]:
        """Get a single product by ID."""
        query = (
            select(Product)
            .options(
                selectinload(Product.variants),
                selectinload(Product.category),
            )
            .where(Product.id == product_id, Product.is_active == True)
        )

        result = await self.db.execute(query)
        product = result.scalar_one_or_none()

        if not product:
            return None

        return self._product_to_response(product)

    async def get_product_by_slug(self, slug: str) -> Optional[ProductResponse]:
        """Get a single product by slug."""
        query = (
            select(Product)
            .options(
                selectinload(Product.variants),
                selectinload(Product.category),
            )
            .where(Product.slug == slug, Product.is_active == True)
        )

        result = await self.db.execute(query)
        product = result.scalar_one_or_none()

        if not product:
            return None

        return self._product_to_response(product)

    async def get_featured_products(self, limit: int = 8) -> list[ProductResponse]:
        """Get featured products."""
        query = (
            select(Product)
            .options(
                selectinload(Product.variants),
                selectinload(Product.category),
            )
            .where(Product.is_active == True, Product.is_featured == True)
            .order_by(Product.created_at.desc())
            .limit(limit)
        )

        result = await self.db.execute(query)
        products = result.scalars().unique().all()

        return [self._product_to_response(p) for p in products]

    def _product_to_response(self, product: Product) -> ProductResponse:
        """Convert Product model to ProductResponse schema."""
        variants = [
            ProductVariantResponse(
                id=v.id,
                product_id=v.product_id,
                size=v.size,
                sku=v.sku,
                stock=v.stock,
                created_at=v.created_at,
                updated_at=v.updated_at,
            )
            for v in product.variants
        ]

        # Calculate derived fields
        in_stock = any(v.stock > 0 for v in product.variants)
        available_sizes = sorted(set(v.size for v in product.variants if v.stock > 0))

        category = None
        if product.category:
            category = CategoryResponse(
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
            category=category,
            meta_title=product.meta_title,
            meta_description=product.meta_description,
            created_at=product.created_at,
            updated_at=product.updated_at,
            variants=variants,
            in_stock=in_stock,
            available_sizes=available_sizes,
        )


class CategoryService:
    """Service for category-related operations."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_categories(self) -> list[CategoryResponse]:
        """Get all categories."""
        query = select(Category).order_by(Category.name)
        result = await self.db.execute(query)
        categories = result.scalars().all()

        return [
            CategoryResponse(
                id=c.id,
                name=c.name,
                slug=c.slug,
                description=c.description,
                image_url=c.image_url,
                parent_id=c.parent_id,
                created_at=c.created_at,
                updated_at=c.updated_at,
            )
            for c in categories
        ]

    async def get_category_by_id(self, category_id: UUID) -> Optional[CategoryResponse]:
        """Get a category by ID."""
        query = select(Category).where(Category.id == category_id)
        result = await self.db.execute(query)
        category = result.scalar_one_or_none()

        if not category:
            return None

        return CategoryResponse(
            id=category.id,
            name=category.name,
            slug=category.slug,
            description=category.description,
            image_url=category.image_url,
            parent_id=category.parent_id,
            created_at=category.created_at,
            updated_at=category.updated_at,
        )

    async def get_category_by_slug(self, slug: str) -> Optional[CategoryResponse]:
        """Get a category by slug."""
        query = select(Category).where(Category.slug == slug)
        result = await self.db.execute(query)
        category = result.scalar_one_or_none()

        if not category:
            return None

        return CategoryResponse(
            id=category.id,
            name=category.name,
            slug=category.slug,
            description=category.description,
            image_url=category.image_url,
            parent_id=category.parent_id,
            created_at=category.created_at,
            updated_at=category.updated_at,
        )
