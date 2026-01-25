"""Admin category management endpoints."""
from uuid import UUID
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import DbSession, AdminUser
from app.models import Category
from app.schemas.category import CategoryResponse

router = APIRouter(prefix="/categories", tags=["admin-categories"])


class CategoryCreate(BaseModel):
    """Schema for category creation."""
    name: str = Field(min_length=1, max_length=100)
    slug: str = Field(min_length=1, max_length=100)
    description: Optional[str] = None
    image_url: Optional[str] = None
    parent_id: Optional[UUID] = None


class CategoryUpdate(BaseModel):
    """Schema for category update."""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    slug: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    image_url: Optional[str] = None
    parent_id: Optional[UUID] = None


def category_to_response(category: Category) -> CategoryResponse:
    """Convert category model to response."""
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


@router.get("", response_model=list[CategoryResponse])
async def list_categories(
    admin: AdminUser,
    db: DbSession,
):
    """List all categories."""
    result = await db.execute(
        select(Category).order_by(Category.name)
    )
    categories = result.scalars().all()
    return [category_to_response(c) for c in categories]


@router.post("", response_model=CategoryResponse, status_code=201)
async def create_category(
    category_data: CategoryCreate,
    admin: AdminUser,
    db: DbSession,
):
    """Create a new category."""
    # Check slug uniqueness
    existing = await db.execute(
        select(Category).where(Category.slug == category_data.slug)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Category with this slug already exists")

    # Validate parent if provided
    if category_data.parent_id:
        parent_result = await db.execute(
            select(Category).where(Category.id == category_data.parent_id)
        )
        if not parent_result.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Parent category not found")

    category = Category(
        name=category_data.name,
        slug=category_data.slug,
        description=category_data.description,
        image_url=category_data.image_url,
        parent_id=category_data.parent_id,
    )

    db.add(category)
    await db.commit()
    await db.refresh(category)

    return category_to_response(category)


@router.get("/{category_id}", response_model=CategoryResponse)
async def get_category(
    category_id: UUID,
    admin: AdminUser,
    db: DbSession,
):
    """Get category by ID."""
    result = await db.execute(
        select(Category).where(Category.id == category_id)
    )
    category = result.scalar_one_or_none()

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    return category_to_response(category)


@router.patch("/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: UUID,
    update_data: CategoryUpdate,
    admin: AdminUser,
    db: DbSession,
):
    """Update a category."""
    result = await db.execute(
        select(Category).where(Category.id == category_id)
    )
    category = result.scalar_one_or_none()

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    # Check slug uniqueness if changed
    if update_data.slug and update_data.slug != category.slug:
        existing = await db.execute(
            select(Category).where(Category.slug == update_data.slug)
        )
        if existing.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Category with this slug already exists")

    # Validate parent if changed
    if update_data.parent_id:
        if update_data.parent_id == category_id:
            raise HTTPException(status_code=400, detail="Category cannot be its own parent")
        parent_result = await db.execute(
            select(Category).where(Category.id == update_data.parent_id)
        )
        if not parent_result.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Parent category not found")

    update_dict = update_data.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(category, field, value)

    await db.commit()
    await db.refresh(category)

    return category_to_response(category)


@router.delete("/{category_id}", status_code=204)
async def delete_category(
    category_id: UUID,
    admin: AdminUser,
    db: DbSession,
):
    """Delete a category."""
    result = await db.execute(
        select(Category).where(Category.id == category_id)
    )
    category = result.scalar_one_or_none()

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    await db.delete(category)
    await db.commit()
