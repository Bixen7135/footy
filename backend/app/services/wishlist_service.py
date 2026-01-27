"""Wishlist service - business logic for wishlist operations."""
from uuid import UUID
from typing import Optional

from sqlalchemy import select, delete
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError
from app.models import Product, WishlistItem
from app.schemas.wishlist import WishlistItemResponse, WishlistResponse
from app.schemas.product import ProductResponse, ProductVariantResponse, CategoryResponse


class WishlistService:
    """Service for wishlist operations."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_wishlist(self, user_id: UUID) -> WishlistResponse:
        """Get all wishlist items for a user."""
        query = (
            select(WishlistItem)
            .options(
                selectinload(WishlistItem.product).selectinload(Product.category),
                selectinload(WishlistItem.product).selectinload(Product.variants),
            )
            .where(WishlistItem.user_id == user_id)
            .order_by(WishlistItem.created_at.desc())
        )

        result = await self.db.execute(query)
        items = result.scalars().all()

        return WishlistResponse(
            items=[self._item_to_response(item) for item in items],
            total=len(items),
        )

    async def add_item(self, user_id: UUID, product_id: UUID) -> WishlistItemResponse:
        """Add a product to the wishlist."""
        # Check if product exists
        product_query = (
            select(Product)
            .options(
                selectinload(Product.category),
                selectinload(Product.variants),
            )
            .where(Product.id == product_id, Product.is_active == True)
        )
        product_result = await self.db.execute(product_query)
        product = product_result.scalar_one_or_none()

        if not product:
            raise NotFoundError("Product", product_id)

        # Check if already in wishlist
        existing_query = select(WishlistItem).where(
            WishlistItem.user_id == user_id,
            WishlistItem.product_id == product_id,
        )
        existing_result = await self.db.execute(existing_query)
        existing = existing_result.scalar_one_or_none()

        if existing:
            # Return existing item (idempotent)
            return self._item_to_response(existing, product)

        # Create new wishlist item
        item = WishlistItem(user_id=user_id, product_id=product_id)
        self.db.add(item)
        await self.db.commit()
        await self.db.refresh(item)

        return self._item_to_response(item, product)

    async def remove_item(self, user_id: UUID, product_id: UUID) -> bool:
        """Remove a product from the wishlist."""
        query = delete(WishlistItem).where(
            WishlistItem.user_id == user_id,
            WishlistItem.product_id == product_id,
        )
        result = await self.db.execute(query)
        await self.db.commit()

        return result.rowcount > 0

    async def is_in_wishlist(self, user_id: UUID, product_id: UUID) -> bool:
        """Check if a product is in the user's wishlist."""
        query = select(WishlistItem).where(
            WishlistItem.user_id == user_id,
            WishlistItem.product_id == product_id,
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none() is not None

    def _item_to_response(
        self, item: WishlistItem, product: Optional[Product] = None
    ) -> WishlistItemResponse:
        """Convert wishlist item to response schema."""
        prod = product or item.product

        # Build variants list
        variants = []
        available_sizes = []
        in_stock = False

        if prod.variants:
            for v in prod.variants:
                variants.append(
                    ProductVariantResponse(
                        id=v.id,
                        product_id=v.product_id,
                        size=v.size,
                        sku=v.sku,
                        stock=v.stock,
                        created_at=v.created_at,
                        updated_at=v.updated_at,
                    )
                )
                if v.stock > 0:
                    in_stock = True
                    available_sizes.append(v.size)

        # Build category response
        category_response = None
        if prod.category:
            category_response = CategoryResponse(
                id=prod.category.id,
                name=prod.category.name,
                slug=prod.category.slug,
                description=prod.category.description,
                image_url=prod.category.image_url,
                parent_id=prod.category.parent_id,
                created_at=prod.category.created_at,
                updated_at=prod.category.updated_at,
            )

        product_response = ProductResponse(
            id=prod.id,
            name=prod.name,
            slug=prod.slug,
            description=prod.description,
            price=float(prod.price),
            compare_at_price=float(prod.compare_at_price) if prod.compare_at_price else None,
            images=prod.images or [],
            brand=prod.brand,
            material=prod.material,
            color=prod.color,
            gender=prod.gender,
            is_active=prod.is_active,
            is_featured=prod.is_featured,
            category_id=prod.category_id,
            category=category_response,
            meta_title=prod.meta_title,
            meta_description=prod.meta_description,
            created_at=prod.created_at,
            updated_at=prod.updated_at,
            variants=variants,
            in_stock=in_stock,
            available_sizes=available_sizes,
        )

        return WishlistItemResponse(
            id=item.id,
            user_id=item.user_id,
            product_id=item.product_id,
            product=product_response,
            created_at=item.created_at,
            updated_at=item.updated_at,
        )
