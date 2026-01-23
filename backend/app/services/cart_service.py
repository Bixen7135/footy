"""Cart service - business logic for shopping cart."""
import json
from datetime import datetime
from uuid import UUID
from typing import Optional
from decimal import Decimal

import redis.asyncio as redis
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Product, ProductVariant, Cart, CartItem, User
from app.schemas import (
    CartItemCreate, CartItemUpdate, CartItemResponse, CartResponse,
    ProductResponse, ProductVariantResponse, CategoryResponse,
)


CART_KEY_PREFIX = "cart:"
CART_TTL = 60 * 60 * 24 * 30  # 30 days


class CartService:
    """Service for cart operations using Redis for fast access."""

    def __init__(self, db: AsyncSession, redis_client: redis.Redis):
        self.db = db
        self.redis = redis_client

    def _cart_key(self, session_id: str) -> str:
        """Generate Redis key for cart."""
        return f"{CART_KEY_PREFIX}{session_id}"

    async def get_cart(self, session_id: str, user_id: Optional[UUID] = None) -> CartResponse:
        """Get cart for session or user."""
        # Try to get cart from Redis first
        cart_key = self._cart_key(session_id)
        cart_data = await self.redis.get(cart_key)

        if cart_data:
            cart_dict = json.loads(cart_data)
            items = cart_dict.get("items", [])
        else:
            items = []

        # Enrich items with product data
        enriched_items = await self._enrich_cart_items(items)

        # Calculate totals
        total = sum(item.subtotal for item in enriched_items)
        item_count = sum(item.quantity for item in enriched_items)

        now = datetime.utcnow()

        return CartResponse(
            id=session_id,
            session_id=session_id,
            user_id=str(user_id) if user_id else None,
            items=enriched_items,
            total=float(total),
            item_count=item_count,
            created_at=now,
            updated_at=now,
        )

    async def add_item(
        self,
        session_id: str,
        item: CartItemCreate,
        user_id: Optional[UUID] = None,
    ) -> CartResponse:
        """Add item to cart."""
        # Validate product and variant exist
        variant = await self._get_variant(item.variant_id)
        if not variant:
            raise ValueError("Product variant not found")

        if variant.stock < (item.quantity or 1):
            raise ValueError("Insufficient stock")

        product = await self._get_product(item.product_id)
        if not product:
            raise ValueError("Product not found")

        # Get current cart
        cart_key = self._cart_key(session_id)
        cart_data = await self.redis.get(cart_key)

        if cart_data:
            cart_dict = json.loads(cart_data)
            items = cart_dict.get("items", [])
        else:
            items = []

        # Check if item already exists
        existing_item = None
        for idx, cart_item in enumerate(items):
            if cart_item["variant_id"] == str(item.variant_id):
                existing_item = idx
                break

        quantity = item.quantity or 1

        if existing_item is not None:
            # Update quantity
            items[existing_item]["quantity"] += quantity
        else:
            # Add new item
            items.append({
                "id": str(UUID(int=len(items) + 1)),  # Simple ID for cart item
                "product_id": str(item.product_id),
                "variant_id": str(item.variant_id),
                "quantity": quantity,
                "unit_price": float(product.price),
            })

        # Save to Redis
        cart_dict = {"items": items, "user_id": str(user_id) if user_id else None}
        await self.redis.setex(cart_key, CART_TTL, json.dumps(cart_dict))

        return await self.get_cart(session_id, user_id)

    async def update_item(
        self,
        session_id: str,
        variant_id: UUID,
        update: CartItemUpdate,
        user_id: Optional[UUID] = None,
    ) -> CartResponse:
        """Update cart item quantity."""
        if update.quantity < 0:
            raise ValueError("Quantity cannot be negative")

        # If quantity is 0, remove the item
        if update.quantity == 0:
            return await self.remove_item(session_id, variant_id, user_id)

        # Validate stock
        variant = await self._get_variant(variant_id)
        if not variant:
            raise ValueError("Product variant not found")

        if variant.stock < update.quantity:
            raise ValueError("Insufficient stock")

        # Get current cart
        cart_key = self._cart_key(session_id)
        cart_data = await self.redis.get(cart_key)

        if not cart_data:
            raise ValueError("Cart not found")

        cart_dict = json.loads(cart_data)
        items = cart_dict.get("items", [])

        # Find and update item
        found = False
        for cart_item in items:
            if cart_item["variant_id"] == str(variant_id):
                cart_item["quantity"] = update.quantity
                found = True
                break

        if not found:
            raise ValueError("Item not found in cart")

        # Save to Redis
        cart_dict["items"] = items
        await self.redis.setex(cart_key, CART_TTL, json.dumps(cart_dict))

        return await self.get_cart(session_id, user_id)

    async def remove_item(
        self,
        session_id: str,
        variant_id: UUID,
        user_id: Optional[UUID] = None,
    ) -> CartResponse:
        """Remove item from cart."""
        cart_key = self._cart_key(session_id)
        cart_data = await self.redis.get(cart_key)

        if not cart_data:
            raise ValueError("Cart not found")

        cart_dict = json.loads(cart_data)
        items = cart_dict.get("items", [])

        # Filter out the item
        items = [item for item in items if item["variant_id"] != str(variant_id)]

        # Save to Redis
        cart_dict["items"] = items
        await self.redis.setex(cart_key, CART_TTL, json.dumps(cart_dict))

        return await self.get_cart(session_id, user_id)

    async def clear_cart(self, session_id: str) -> None:
        """Clear all items from cart."""
        cart_key = self._cart_key(session_id)
        await self.redis.delete(cart_key)

    async def merge_carts(
        self,
        anonymous_session_id: str,
        user_id: UUID,
    ) -> CartResponse:
        """Merge anonymous cart into user's cart on login."""
        # Get anonymous cart
        anon_cart_key = self._cart_key(anonymous_session_id)
        anon_cart_data = await self.redis.get(anon_cart_key)

        if not anon_cart_data:
            # No anonymous cart to merge
            return await self.get_cart(anonymous_session_id, user_id)

        anon_cart = json.loads(anon_cart_data)
        anon_items = anon_cart.get("items", [])

        # Update cart with user_id
        cart_dict = {"items": anon_items, "user_id": str(user_id)}
        await self.redis.setex(anon_cart_key, CART_TTL, json.dumps(cart_dict))

        return await self.get_cart(anonymous_session_id, user_id)

    async def _get_product(self, product_id: UUID) -> Optional[Product]:
        """Get product by ID."""
        query = (
            select(Product)
            .options(selectinload(Product.category))
            .where(Product.id == product_id, Product.is_active == True)
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def _get_variant(self, variant_id: UUID) -> Optional[ProductVariant]:
        """Get product variant by ID."""
        query = select(ProductVariant).where(ProductVariant.id == variant_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def _enrich_cart_items(self, items: list[dict]) -> list[CartItemResponse]:
        """Enrich cart items with full product data."""
        enriched = []

        for item in items:
            product_id = UUID(item["product_id"])
            variant_id = UUID(item["variant_id"])

            product = await self._get_product(product_id)
            if not product:
                continue  # Skip items with deleted products

            variant_query = select(ProductVariant).where(ProductVariant.id == variant_id)
            variant_result = await self.db.execute(variant_query)
            variant = variant_result.scalar_one_or_none()

            if not variant:
                continue  # Skip items with deleted variants

            # Build product response
            product_response = ProductResponse(
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
                category=CategoryResponse(
                    id=product.category.id,
                    name=product.category.name,
                    slug=product.category.slug,
                    description=product.category.description,
                    image_url=product.category.image_url,
                    parent_id=product.category.parent_id,
                    created_at=product.category.created_at,
                    updated_at=product.category.updated_at,
                ) if product.category else None,
                meta_title=product.meta_title,
                meta_description=product.meta_description,
                created_at=product.created_at,
                updated_at=product.updated_at,
                variants=[],  # Not needed for cart display
                in_stock=variant.stock > 0,
                available_sizes=[],
            )

            variant_response = ProductVariantResponse(
                id=variant.id,
                product_id=variant.product_id,
                size=variant.size,
                sku=variant.sku,
                stock=variant.stock,
                created_at=variant.created_at,
                updated_at=variant.updated_at,
            )

            unit_price = float(item["unit_price"])
            quantity = item["quantity"]

            now = datetime.utcnow()
            enriched.append(CartItemResponse(
                id=item["id"],
                product_id=str(product_id),
                variant_id=str(variant_id),
                quantity=quantity,
                unit_price=unit_price,
                subtotal=unit_price * quantity,
                product=product_response,
                variant=variant_response,
                created_at=now,
                updated_at=now,
            ))

        return enriched
