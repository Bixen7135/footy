"""Category schemas."""
from typing import Optional
from uuid import UUID
from pydantic import Field

from app.schemas.base import BaseSchema, TimestampSchema, IDSchema


class CategoryBase(BaseSchema):
    """Base category schema."""
    name: str = Field(min_length=1, max_length=100)
    slug: str = Field(min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    image_url: Optional[str] = Field(None, max_length=500)
    parent_id: Optional[UUID] = None


class CategoryCreate(CategoryBase):
    """Schema for creating a category."""
    pass


class CategoryUpdate(BaseSchema):
    """Schema for updating a category."""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    slug: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    image_url: Optional[str] = Field(None, max_length=500)
    parent_id: Optional[UUID] = None


class CategoryResponse(CategoryBase, IDSchema, TimestampSchema):
    """Schema for category response."""
    pass


class CategoryWithChildren(CategoryResponse):
    """Category with nested children."""
    children: list["CategoryWithChildren"] = []


# Update forward reference
CategoryWithChildren.model_rebuild()
