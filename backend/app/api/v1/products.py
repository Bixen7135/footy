"""Product API endpoints."""
from uuid import UUID
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query

from app.api.deps import DbSession
from app.schemas import ProductResponse, ProductListResponse, ProductFilters
from app.services.product_service import ProductService

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=ProductListResponse)
async def list_products(
    db: DbSession,
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(12, ge=1, le=100, description="Items per page"),
    category_id: Optional[UUID] = Query(None, description="Filter by category ID"),
    category_slug: Optional[str] = Query(None, description="Filter by category slug"),
    brand: Optional[str] = Query(None, description="Filter by brand"),
    color: Optional[str] = Query(None, description="Filter by color"),
    gender: Optional[str] = Query(None, description="Filter by gender"),
    min_price: Optional[float] = Query(None, ge=0, description="Minimum price"),
    max_price: Optional[float] = Query(None, ge=0, description="Maximum price"),
    sizes: Optional[str] = Query(None, description="Comma-separated list of sizes"),
    in_stock: Optional[bool] = Query(None, description="Filter by in-stock status"),
    is_featured: Optional[bool] = Query(None, description="Filter featured products"),
    search: Optional[str] = Query(None, description="Search term"),
):
    """
    Get paginated list of products with optional filters.

    - **page**: Page number (default: 1)
    - **page_size**: Items per page (default: 12, max: 100)
    - **category_id**: Filter by category UUID
    - **category_slug**: Filter by category slug
    - **brand**: Filter by brand name (partial match)
    - **color**: Filter by color (partial match)
    - **gender**: Filter by gender (men, women, unisex, kids)
    - **min_price**: Minimum price filter
    - **max_price**: Maximum price filter
    - **sizes**: Comma-separated list of sizes (e.g., "40,41,42")
    - **in_stock**: Filter only in-stock products
    - **is_featured**: Filter featured products
    - **search**: Search in name, description, brand
    """
    # Parse sizes from comma-separated string
    size_list = None
    if sizes:
        size_list = [s.strip() for s in sizes.split(",") if s.strip()]

    filters = ProductFilters(
        category_id=category_id,
        category_slug=category_slug,
        brand=brand,
        color=color,
        gender=gender,
        min_price=min_price,
        max_price=max_price,
        sizes=size_list,
        in_stock=in_stock,
        is_featured=is_featured,
        search=search,
    )

    service = ProductService(db)
    return await service.get_products(filters=filters, page=page, page_size=page_size)


@router.get("/featured", response_model=list[ProductResponse])
async def get_featured_products(
    db: DbSession,
    limit: int = Query(8, ge=1, le=20, description="Number of featured products"),
):
    """Get featured products for homepage."""
    service = ProductService(db)
    return await service.get_featured_products(limit=limit)


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: UUID,
    db: DbSession,
):
    """
    Get a single product by ID.

    Returns full product details including variants and category.
    """
    service = ProductService(db)
    product = await service.get_product_by_id(product_id)

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return product


@router.get("/slug/{slug}", response_model=ProductResponse)
async def get_product_by_slug(
    slug: str,
    db: DbSession,
):
    """
    Get a single product by slug.

    Returns full product details including variants and category.
    """
    service = ProductService(db)
    product = await service.get_product_by_slug(slug)

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return product
