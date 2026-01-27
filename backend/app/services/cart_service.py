"""Cart service - business logic for shopping cart."""
import json
from datetime import datetime
from uuid import UUID
from typing import Optional, Callable
from decimal import Decimal

import redis.asyncio as redis
from redis.exceptions import WatchError
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import (
    InsufficientStockError,
    NotFoundError,
    ValidationError,
)
from app.models import Product, ProductVariant, Cart, CartItem, User
from app.schemas import (
    CartItemCreate, CartItemUpdate, CartItemResponse, CartResponse,
    ProductResponse, ProductVariantResponse, CategoryResponse,
)


CART_KEY_PREFIX = "cart:"
CART_TTL = 60 * 60 * 24 * 30  # 30 days
MAX_RETRIES = 5  # Maximum retries for atomic operations


class CartService:
    """Service for cart operations using Redis for fast access."""

    def __init__(self, db: AsyncSession, redis_client: redis.Redis):
        self.db = db
        self.redis = redis_client

    def _cart_key(self, session_id: str) -> str:
        """Generate Redis key for cart."""
        return f"{CART_KEY_PREFIX}{session_id}"

    async def _atomic_update_cart(
        self,
        session_id: str,
        modifier_fn: Callable[[dict], dict],
        user_id: Optional[UUID] = None,
    ) -> dict:
        """
        Atomically update cart using Redis WATCH/MULTI/EXEC pattern.

        This prevents lost updates when multiple requests modify the same cart
        concurrently. If the cart is modified between WATCH and EXEC, the
        transaction is retried.

        Args:
            session_id: The cart session identifier
            modifier_fn: A function that takes the current cart dict and returns modified cart dict
            user_id: Optional user ID to associate with the cart

        Returns:
            The modified cart dictionary

        Raises:
            RuntimeError: If max retries exceeded
        """
        cart_key = self._cart_key(session_id)

        for attempt in range(MAX_RETRIES):
            try:
                async with self.redis.pipeline(transaction=True) as pipe:
                    # Watch the cart key for changes
                    await pipe.watch(cart_key)

                    # Get current cart data through watched pipeline
                    results = await pipe.get(cart_key).execute()
                    cart_data = results[0]
                    if cart_data:
                        cart_dict = json.loads(cart_data)
                    else:
                        cart_dict = {"items": [], "user_id": str(user_id) if user_id else None}

                    # Apply modification function
                    modified_cart = modifier_fn(cart_dict)

                    # Update user_id if provided
                    if user_id:
                        modified_cart["user_id"] = str(user_id)

                    # Start transaction
                    pipe.multi()

                    # Set the modified cart atomically
                    pipe.setex(cart_key, CART_TTL, json.dumps(modified_cart))

                    # Execute transaction
                    await pipe.execute()

                    return modified_cart

            except WatchError:
                # Cart was modified by another request, retry
                if attempt == MAX_RETRIES - 1:
                    raise RuntimeError(
                        f"Failed to update cart after {MAX_RETRIES} attempts due to concurrent modifications"
                    )
                continue

        # Should not reach here, but just in case
        raise RuntimeError("Unexpected error in atomic cart update")

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
        """Add item to cart with atomic Redis operations."""
        # Validate product and variant exist
        variant = await self._get_variant(item.variant_id)
        if not variant:
            raise NotFoundError("ProductVariant", item.variant_id)

        quantity = item.quantity or 1

        # Get existing quantity if item already in cart
        cart_key = self._cart_key(session_id)
        cart_data = await self.redis.get(cart_key)
        existing_qty = 0
        if cart_data:
            cart_dict = json.loads(cart_data)
            for cart_item in cart_dict.get("items", []):
                if cart_item["variant_id"] == str(item.variant_id):
                    existing_qty = cart_item["quantity"]
                    break

        # Validate total quantity
        total_qty = existing_qty + quantity
        if variant.stock < total_qty:
            product_for_error = await self._get_product(item.product_id)
            product_name = product_for_error.name if product_for_error else "Unknown product"
            raise InsufficientStockError(product_name, total_qty, variant.stock)

        product = await self._get_product(item.product_id)
        if not product:
            raise NotFoundError("Product", item.product_id)

        # Capture values for closure
        variant_id_str = str(item.variant_id)
        product_id_str = str(item.product_id)
        product_price = str(product.price)

        def add_item_modifier(cart_dict: dict) -> dict:
            """Modifier function to add item to cart."""
            items = cart_dict.get("items", [])

            # Check if item already exists
            existing_idx = None
            for idx, cart_item in enumerate(items):
                if cart_item["variant_id"] == variant_id_str:
                    existing_idx = idx
                    break

            if existing_idx is not None:
                # Update quantity
                items[existing_idx]["quantity"] += quantity
            else:
                # Generate a unique ID based on timestamp and item count
                import uuid
                items.append({
                    "id": str(uuid.uuid4()),
                    "product_id": product_id_str,
                    "variant_id": variant_id_str,
                    "quantity": quantity,
                    "unit_price": product_price,
                })

            cart_dict["items"] = items
            return cart_dict

        # Atomically update cart
        await self._atomic_update_cart(session_id, add_item_modifier, user_id)

        return await self.get_cart(session_id, user_id)

    async def update_item(
        self,
        session_id: str,
        variant_id: UUID,
        update: CartItemUpdate,
        user_id: Optional[UUID] = None,
    ) -> CartResponse:
        """Update cart item quantity with atomic Redis operations."""
        if update.quantity < 0:
            raise ValidationError("Quantity cannot be negative", "quantity")

        # If quantity is 0, remove the item
        if update.quantity == 0:
            return await self.remove_item(session_id, variant_id, user_id)

        # Validate stock
        variant = await self._get_variant(variant_id)
        if not variant:
            raise NotFoundError("ProductVariant", variant_id)

        if variant.stock < update.quantity:
            product = await self._get_product(variant.product_id)
            product_name = product.name if product else "Unknown product"
            raise InsufficientStockError(product_name, update.quantity, variant.stock)

        # Check cart exists before atomic update
        cart_key = self._cart_key(session_id)
        cart_data = await self.redis.get(cart_key)
        if not cart_data:
            raise NotFoundError("Cart", session_id)

        # Capture values for closure
        variant_id_str = str(variant_id)
        new_quantity = update.quantity

        class ItemNotFoundError(Exception):
            pass

        def update_item_modifier(cart_dict: dict) -> dict:
            """Modifier function to update item quantity."""
            items = cart_dict.get("items", [])

            found = False
            for cart_item in items:
                if cart_item["variant_id"] == variant_id_str:
                    cart_item["quantity"] = new_quantity
                    found = True
                    break

            if not found:
                raise ItemNotFoundError()

            cart_dict["items"] = items
            return cart_dict

        try:
            await self._atomic_update_cart(session_id, update_item_modifier, user_id)
        except ItemNotFoundError:
            raise NotFoundError("CartItem", variant_id)

        return await self.get_cart(session_id, user_id)

    async def remove_item(
        self,
        session_id: str,
        variant_id: UUID,
        user_id: Optional[UUID] = None,
    ) -> CartResponse:
        """Remove item from cart with atomic Redis operations."""
        # Check cart exists before atomic update
        cart_key = self._cart_key(session_id)
        cart_data = await self.redis.get(cart_key)
        if not cart_data:
            raise NotFoundError("Cart", session_id)

        # Capture values for closure
        variant_id_str = str(variant_id)

        def remove_item_modifier(cart_dict: dict) -> dict:
            """Modifier function to remove item from cart."""
            items = cart_dict.get("items", [])
            # Filter out the item
            items = [item for item in items if item["variant_id"] != variant_id_str]
            cart_dict["items"] = items
            return cart_dict

        await self._atomic_update_cart(session_id, remove_item_modifier, user_id)

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

    async def refresh_prices(
        self,
        session_id: str,
        user_id: Optional[UUID] = None,
    ) -> CartResponse:
        """
        Refresh cart item prices to match current product prices.

        This should be called when a PriceChangedError is received during checkout,
        or periodically to keep cart prices up-to-date.

        Returns the updated cart with current prices.
        """
        # Get current cart
        cart_key = self._cart_key(session_id)
        cart_data = await self.redis.get(cart_key)

        if not cart_data:
            return await self.get_cart(session_id, user_id)

        cart_dict = json.loads(cart_data)
        items = cart_dict.get("items", [])

        if not items:
            return await self.get_cart(session_id, user_id)

        # Update each item's price to current product price
        updated_items = []
        for item in items:
            product_id = UUID(item["product_id"])
            product = await self._get_product(product_id)

            if not product:
                # Skip items with deleted products
                continue

            # Update price to current product price
            updated_item = item.copy()
            updated_item["unit_price"] = str(product.price)
            updated_items.append(updated_item)

        # Save updated cart atomically
        def update_prices_modifier(cart_dict: dict) -> dict:
            cart_dict["items"] = updated_items
            return cart_dict

        await self._atomic_update_cart(session_id, update_prices_modifier, user_id)

        return await self.get_cart(session_id, user_id)

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

            unit_price = Decimal(item["unit_price"])
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
