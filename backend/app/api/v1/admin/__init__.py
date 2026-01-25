# Admin API endpoints
from fastapi import APIRouter

from app.api.v1.admin import products, orders, categories

router = APIRouter(prefix="/admin", tags=["admin"])

# Include admin sub-routers
router.include_router(products.router)
router.include_router(orders.router)
router.include_router(categories.router)
