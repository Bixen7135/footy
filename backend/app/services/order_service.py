"""Order service - business logic for order management."""
import json
import random
import string
from uuid import UUID
from decimal import Decimal
from datetime import datetime
from typing import Optional

import redis.asyncio as redis
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.transaction import atomic_transaction
from app.models import Order, OrderItem, Product, ProductVariant, User
from app.models.order import OrderStatus
from app.schemas.order import OrderCreate, OrderResponse, OrderItemResponse, ShippingAddress
from app.core.exceptions import (
    CartEmptyError,
    NotFoundError,
    PriceChangedError,
    ValidationError,
)
from app.core.logging import get_logger

logger = get_logger(__name__)


# Constants
TAX_RATE = Decimal("0.08")  # 8% tax
SHIPPING_THRESHOLD = Decimal("100.00")  # Free shipping over $100
SHIPPING_COST = Decimal("9.99")  # Standard shipping

CART_KEY_PREFIX = "cart:"


class OrderService:
    """Service for order operations."""

    def __init__(self, db: AsyncSession, redis_client: redis.Redis):
        self.db = db
        self.redis = redis_client

    def _cart_key(self, session_id: str) -> str:
        """Generate Redis key for cart."""
        return f"{CART_KEY_PREFIX}{session_id}"

    def _generate_order_number(self) -> str:
        """Generate a unique order number."""
        timestamp = datetime.utcnow().strftime("%Y%m%d")
        random_part = "".join(random.choices(string.ascii_uppercase + string.digits, k=6))
        return f"FT-{timestamp}-{random_part}"

    async def _get_cart_items(self, session_id: str) -> list[dict]:
        """Get cart items from Redis."""
        cart_key = self._cart_key(session_id)
        cart_data = await self.redis.get(cart_key)

        if not cart_data:
            return []

        cart_dict = json.loads(cart_data)
        return cart_dict.get("items", [])

    async def _clear_cart(self, session_id: str) -> None:
        """Clear cart after order creation."""
        cart_key = self._cart_key(session_id)
        await self.redis.delete(cart_key)

    async def _validate_and_reserve_stock(
        self, cart_items: list[dict]
    ) -> tuple[bool, str, list[tuple[ProductVariant, int]]]:
        """
        Validate stock availability and prepare for reservation.
        Returns (success, error_message, list of (variant, quantity) tuples)
        """
        reservations = []

        # Sort by variant_id to ensure consistent lock order across transactions
        cart_items_sorted = sorted(cart_items, key=lambda x: x["variant_id"])

        for item in cart_items_sorted:
            variant_id = UUID(item["variant_id"])
            quantity = item["quantity"]

            # Get variant with lock for update (prevents concurrent modification)
            query = (
                select(ProductVariant)
                .where(ProductVariant.id == variant_id)
                .with_for_update()
            )
            result = await self.db.execute(query)
            variant = result.scalar_one_or_none()

            if not variant:
                return False, f"Product variant not found", []

            if variant.stock < quantity:
                # Get product name for error message
                product_query = select(Product).where(Product.id == variant.product_id)
                product_result = await self.db.execute(product_query)
                product = product_result.scalar_one_or_none()
                product_name = product.name if product else "Unknown product"

                return (
                    False,
                    f"Insufficient stock for {product_name} (Size {variant.size}). Available: {variant.stock}",
                    [],
                )

            reservations.append((variant, quantity))

        return True, "", reservations

    async def _deduct_stock(self, reservations: list[tuple[ProductVariant, int]]) -> None:
        """Deduct stock for reserved items."""
        for variant, quantity in reservations:
            variant.stock -= quantity
            self.db.add(variant)

    async def check_idempotency(
        self, idempotency_key: str, user_id: UUID
    ) -> Optional[Order]:
        """
        Check if an order with this idempotency key already exists.
        Returns the existing order if found.
        """
        query = (
            select(Order)
            .options(selectinload(Order.items))
            .where(
                Order.idempotency_key == idempotency_key,
                Order.user_id == user_id,
            )
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def create_order(
        self,
        order_data: OrderCreate,
        user_id: UUID,
        session_id: str,
    ) -> OrderResponse:
        """
        Create a new order from the user's cart.

        Implements idempotency: if an order with the same idempotency_key exists,
        returns that order instead of creating a duplicate.
        """
        # Check idempotency - return existing order if found
        existing_order = await self.check_idempotency(order_data.idempotency_key, user_id)
        if existing_order:
            return self._order_to_response(existing_order)

        # Get cart items
        cart_items = await self._get_cart_items(session_id)
        if not cart_items:
            raise CartEmptyError()

        # Use SERIALIZABLE isolation level for the order creation transaction
        # This prevents phantom reads and ensures consistency for stock validation
        # and order creation
        logger.debug(
            "Starting order creation transaction",
            extra={"session_id": session_id, "user_id": str(user_id)},
        )

        try:
            async with atomic_transaction(self.db, "SERIALIZABLE"):
                # Validate and reserve stock
                success, error_msg, reservations = await self._validate_and_reserve_stock(cart_items)
                if not success:
                    raise ValidationError(error_msg)

                # Calculate totals
                subtotal = Decimal("0.00")
                order_items_data = []

                for item in cart_items:
                    product_id = UUID(item["product_id"])
                    variant_id = UUID(item["variant_id"])
                    quantity = item["quantity"]
                    unit_price = Decimal(str(item["unit_price"]))

                    # Get product info for snapshot
                    product_query = (
                        select(Product)
                        .where(Product.id == product_id)
                    )
                    product_result = await self.db.execute(product_query)
                    product = product_result.scalar_one_or_none()

                    variant_query = select(ProductVariant).where(ProductVariant.id == variant_id)
                    variant_result = await self.db.execute(variant_query)
                    variant = variant_result.scalar_one_or_none()

                    if not product or not variant:
                        raise NotFoundError("Product or ProductVariant", item["variant_id"])

                    # Validate price hasn't changed since item was added to cart
                    current_price = product.price
                    if current_price != unit_price:
                        raise PriceChangedError(
                            product_name=product.name,
                            cart_price=str(unit_price),
                            current_price=str(current_price),
                        )

                    item_subtotal = unit_price * quantity
                    subtotal += item_subtotal

                    order_items_data.append({
                        "product_id": product_id,
                        "variant_id": variant_id,
                        "product_name": product.name,
                        "product_image": product.images[0] if product.images else None,
                        "size": variant.size,
                        "quantity": quantity,
                        "unit_price": unit_price,
                    })

                # Calculate shipping (free over threshold)
                shipping_cost = Decimal("0.00") if subtotal >= SHIPPING_THRESHOLD else SHIPPING_COST

                # Calculate tax
                tax = (subtotal * TAX_RATE).quantize(Decimal("0.01"))

                # Calculate total
                total = subtotal + shipping_cost + tax

                # Generate order number
                order_number = self._generate_order_number()

                # Ensure unique order number
                while True:
                    check_query = select(Order).where(Order.order_number == order_number)
                    check_result = await self.db.execute(check_query)
                    if not check_result.scalar_one_or_none():
                        break
                    order_number = self._generate_order_number()

                # Create order
                order = Order(
                    order_number=order_number,
                    idempotency_key=order_data.idempotency_key,
                    user_id=user_id,
                    session_id=session_id,
                    status=OrderStatus.PENDING,
                    subtotal=subtotal,
                    shipping_cost=shipping_cost,
                    tax=tax,
                    total=total,
                    shipping_address=order_data.shipping_address.model_dump(),
                    notes=order_data.notes,
                )

                self.db.add(order)
                await self.db.flush()  # Get order ID

                # Create order items
                for item_data in order_items_data:
                    order_item = OrderItem(
                        order_id=order.id,
                        **item_data,
                    )
                    self.db.add(order_item)

                # Deduct stock
                await self._deduct_stock(reservations)

                # Transaction commits automatically on success
                logger.info(
                    "Order created successfully",
                    extra={
                        "order_id": str(order.id),
                        "order_number": order_number,
                        "user_id": str(user_id),
                        "total": str(total),
                    },
                )

        except Exception as e:
            # Transaction rolls back automatically on any error
            logger.error(
                "Order creation failed, transaction rolled back",
                extra={
                    "session_id": session_id,
                    "user_id": str(user_id),
                    "error": str(e),
                },
            )
            raise

        # Clear cart after successful order (outside transaction)
        await self._clear_cart(session_id)

        # Refresh to get items
        await self.db.refresh(order)

        # Reload with items
        query = (
            select(Order)
            .options(selectinload(Order.items))
            .where(Order.id == order.id)
        )
        result = await self.db.execute(query)
        order = result.scalar_one()

        return self._order_to_response(order)

    async def get_order(self, order_id: UUID, user_id: UUID) -> Optional[OrderResponse]:
        """Get a specific order by ID for a user."""
        query = (
            select(Order)
            .options(selectinload(Order.items))
            .where(Order.id == order_id, Order.user_id == user_id)
        )
        result = await self.db.execute(query)
        order = result.scalar_one_or_none()

        if not order:
            return None

        return self._order_to_response(order)

    async def get_order_by_number(
        self, order_number: str, user_id: UUID
    ) -> Optional[OrderResponse]:
        """Get a specific order by order number for a user."""
        query = (
            select(Order)
            .options(selectinload(Order.items))
            .where(Order.order_number == order_number, Order.user_id == user_id)
        )
        result = await self.db.execute(query)
        order = result.scalar_one_or_none()

        if not order:
            return None

        return self._order_to_response(order)

    async def list_user_orders(
        self,
        user_id: UUID,
        page: int = 1,
        page_size: int = 10,
    ) -> dict:
        """List all orders for a user with pagination."""
        # Count query
        count_query = (
            select(func.count(Order.id))
            .where(Order.user_id == user_id)
        )
        count_result = await self.db.execute(count_query)
        total = count_result.scalar()

        # Calculate pagination
        pages = (total + page_size - 1) // page_size if total > 0 else 1
        offset = (page - 1) * page_size

        # Orders query
        query = (
            select(Order)
            .options(selectinload(Order.items))
            .where(Order.user_id == user_id)
            .order_by(Order.created_at.desc())
            .offset(offset)
            .limit(page_size)
        )
        result = await self.db.execute(query)
        orders = result.scalars().all()

        return {
            "items": [self._order_to_response(order) for order in orders],
            "total": total,
            "page": page,
            "page_size": page_size,
            "pages": pages,
        }

    def _order_to_response(self, order: Order) -> OrderResponse:
        """Convert Order model to response schema."""
        return OrderResponse(
            id=order.id,
            order_number=order.order_number,
            user_id=order.user_id,
            status=order.status,
            subtotal=order.subtotal,
            shipping_cost=order.shipping_cost,
            tax=order.tax,
            total=order.total,
            shipping_address=ShippingAddress(**order.shipping_address),
            notes=order.notes,
            items=[
                OrderItemResponse(
                    id=item.id,
                    product_id=item.product_id,
                    variant_id=item.variant_id,
                    product_name=item.product_name,
                    product_image=item.product_image,
                    size=item.size,
                    quantity=item.quantity,
                    unit_price=item.unit_price,
                    subtotal=item.subtotal,
                    created_at=item.created_at,
                    updated_at=item.updated_at,
                )
                for item in order.items
            ],
            created_at=order.created_at,
            updated_at=order.updated_at,
        )
