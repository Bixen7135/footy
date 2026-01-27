"""Wishlist API endpoints."""
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import DbSession, CurrentUser
from app.schemas.wishlist import WishlistItemCreate, WishlistItemResponse, WishlistResponse
from app.services.wishlist_service import WishlistService

router = APIRouter(prefix="/wishlist", tags=["wishlist"])


async def get_wishlist_service(db: DbSession) -> WishlistService:
    """Dependency for wishlist service."""
    return WishlistService(db)


@router.get("", response_model=WishlistResponse)
async def get_wishlist(
    current_user: CurrentUser,
    wishlist_service: WishlistService = Depends(get_wishlist_service),
):
    """
    Get the current user's wishlist.

    Requires authentication. Returns all wishlist items with product details.
    """
    return await wishlist_service.get_wishlist(current_user.id)


@router.post("/items", response_model=WishlistItemResponse, status_code=201)
async def add_to_wishlist(
    item_data: WishlistItemCreate,
    current_user: CurrentUser,
    wishlist_service: WishlistService = Depends(get_wishlist_service),
):
    """
    Add a product to the wishlist.

    - **product_id**: UUID of the product to add

    Idempotent: adding the same product twice returns the existing item.
    Requires authentication.
    """
    return await wishlist_service.add_item(current_user.id, item_data.product_id)


@router.delete("/items/{product_id}", status_code=204)
async def remove_from_wishlist(
    product_id: UUID,
    current_user: CurrentUser,
    wishlist_service: WishlistService = Depends(get_wishlist_service),
):
    """
    Remove a product from the wishlist.

    - **product_id**: UUID of the product to remove

    Requires authentication.
    """
    removed = await wishlist_service.remove_item(current_user.id, product_id)
    if not removed:
        raise HTTPException(status_code=404, detail="Product not in wishlist")


@router.get("/items/{product_id}/check", response_model=dict)
async def check_wishlist(
    product_id: UUID,
    current_user: CurrentUser,
    wishlist_service: WishlistService = Depends(get_wishlist_service),
):
    """
    Check if a product is in the wishlist.

    - **product_id**: UUID of the product to check

    Requires authentication.
    """
    in_wishlist = await wishlist_service.is_in_wishlist(current_user.id, product_id)
    return {"in_wishlist": in_wishlist}
