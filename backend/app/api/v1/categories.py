"""Category API endpoints."""
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import DbSession
from app.schemas import CategoryResponse
from app.services.product_service import CategoryService

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("", response_model=list[CategoryResponse])
async def list_categories(db: DbSession):
    """
    Get all product categories.

    Returns a list of all categories ordered by name.
    """
    service = CategoryService(db)
    return await service.get_categories()


@router.get("/{category_id}", response_model=CategoryResponse)
async def get_category(
    category_id: UUID,
    db: DbSession,
):
    """Get a single category by ID."""
    service = CategoryService(db)
    category = await service.get_category_by_id(category_id)

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    return category


@router.get("/slug/{slug}", response_model=CategoryResponse)
async def get_category_by_slug(
    slug: str,
    db: DbSession,
):
    """Get a single category by slug."""
    service = CategoryService(db)
    category = await service.get_category_by_slug(slug)

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    return category
