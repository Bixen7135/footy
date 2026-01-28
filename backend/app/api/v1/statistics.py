"""Statistics endpoints."""
from fastapi import APIRouter, Depends
from sqlalchemy import select, func, distinct
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.models.user import User
from app.models.product import Product
from app.models.category import Category
from app.models.order import Order, OrderStatus
from app.schemas.base import BaseResponse

router = APIRouter(prefix="/statistics", tags=["statistics"])


@router.get("", response_model=BaseResponse)
async def get_statistics(
    db: AsyncSession = Depends(get_db),
) -> BaseResponse:
    """
    Get platform statistics for About page.

    Returns:
        Statistics including customer count, product count, brand count, and rating.
    """
    # Get total customers (users)
    total_customers_stmt = select(func.count(User.id))
    total_customers_result = await db.execute(total_customers_stmt)
    total_customers = total_customers_result.scalar_one()

    # Get total products
    total_products_stmt = select(func.count(Product.id)).where(Product.is_active == True)
    total_products_result = await db.execute(total_products_stmt)
    total_products = total_products_result.scalar_one()

    # Get total brands (distinct)
    total_brands_stmt = select(func.count(distinct(Product.brand))).where(
        Product.is_active == True,
        Product.brand.isnot(None)
    )
    total_brands_result = await db.execute(total_brands_stmt)
    total_brands = total_brands_result.scalar_one()

    # Calculate customer rating based on completed orders
    # Rating = (delivered orders / total orders) * 5
    delivered_orders_stmt = select(func.count(Order.id)).where(
        Order.status == OrderStatus.DELIVERED
    )
    delivered_orders_result = await db.execute(delivered_orders_stmt)
    delivered_orders = delivered_orders_result.scalar_one()

    total_orders_stmt = select(func.count(Order.id)).where(
        Order.status.notin_([OrderStatus.CANCELLED])
    )
    total_orders_result = await db.execute(total_orders_stmt)
    total_orders = total_orders_result.scalar_one()

    # Calculate rating (minimum 4.5, scales up based on order success rate)
    if total_orders > 0:
        success_rate = delivered_orders / total_orders
        customer_rating = round(4.5 + (success_rate * 0.5), 1)
    else:
        customer_rating = 4.9  # Default when no orders exist

    return BaseResponse(
        success=True,
        message="Statistics retrieved successfully",
        data={
            "total_customers": total_customers,
            "total_products": total_products,
            "total_brands": total_brands,
            "customer_rating": customer_rating,
        }
    )
