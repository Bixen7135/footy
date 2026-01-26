"""Custom exception classes for the Footy application."""
from typing import Any, Optional


class FootyException(Exception):
    """Base exception for Footy application."""

    def __init__(
        self,
        message: str,
        status_code: int = 500,
        error_code: Optional[str] = None,
        details: Optional[dict[str, Any]] = None,
    ):
        self.message = message
        self.status_code = status_code
        self.error_code = error_code or self.__class__.__name__
        self.details = details or {}
        super().__init__(message)


class NotFoundError(FootyException):
    """Resource not found."""

    def __init__(self, resource: str, identifier: Any):
        super().__init__(
            message=f"{resource} not found",
            status_code=404,
            details={"resource": resource, "identifier": str(identifier)},
        )


class ValidationError(FootyException):
    """Validation error."""

    def __init__(self, message: str, field: Optional[str] = None):
        super().__init__(
            message=message,
            status_code=400,
            details={"field": field} if field else {},
        )


class AuthenticationError(FootyException):
    """Authentication error."""

    def __init__(self, message: str = "Authentication required"):
        super().__init__(message=message, status_code=401)


class AuthorizationError(FootyException):
    """Authorization error."""

    def __init__(self, message: str = "Access denied"):
        super().__init__(message=message, status_code=403)


class ConflictError(FootyException):
    """Resource conflict."""

    def __init__(self, message: str, resource: Optional[str] = None):
        super().__init__(
            message=message,
            status_code=409,
            details={"resource": resource} if resource else {},
        )


class InsufficientStockError(FootyException):
    """Insufficient stock for operation."""

    def __init__(self, product_name: str, requested: int, available: int):
        super().__init__(
            message=f"Insufficient stock for {product_name}",
            status_code=400,
            error_code="INSUFFICIENT_STOCK",
            details={
                "product_name": product_name,
                "requested": requested,
                "available": available,
            },
        )


class DuplicateOrderError(FootyException):
    """Duplicate order attempt (idempotency).

    Returns 200 status code to maintain idempotent behavior -
    the order already exists so the operation was successful.
    """

    def __init__(self, idempotency_key: str, existing_order_id: str):
        super().__init__(
            message="Order already exists for this idempotency key",
            status_code=200,  # Return 200 for idempotent operations
            error_code="DUPLICATE_ORDER",
            details={
                "idempotency_key": idempotency_key,
                "existing_order_id": existing_order_id,
            },
        )


class InvalidTokenError(FootyException):
    """Invalid or expired token."""

    def __init__(self, message: str = "Invalid or expired token"):
        super().__init__(
            message=message,
            status_code=401,
            error_code="INVALID_TOKEN",
        )


class RateLimitError(FootyException):
    """Rate limit exceeded."""

    def __init__(self, retry_after: int = 60):
        super().__init__(
            message="Too many requests",
            status_code=429,
            error_code="RATE_LIMIT_EXCEEDED",
            details={"retry_after": retry_after},
        )


class PriceChangedError(FootyException):
    """Product price has changed since it was added to cart.

    Returns 409 Conflict to indicate the cart state is stale
    and needs to be refreshed before checkout can proceed.
    """

    def __init__(self, product_name: str, cart_price: str, current_price: str):
        super().__init__(
            message=f"Price for {product_name} has changed from ${cart_price} to ${current_price}",
            status_code=409,
            error_code="PRICE_CHANGED",
            details={
                "product_name": product_name,
                "cart_price": cart_price,
                "current_price": current_price,
            },
        )


class CartEmptyError(FootyException):
    """Cart is empty when trying to checkout."""

    def __init__(self):
        super().__init__(
            message="Cannot checkout with an empty cart",
            status_code=400,
            error_code="CART_EMPTY",
        )


class ConcurrencyError(FootyException):
    """Concurrent modification detected."""

    def __init__(self, resource: str):
        super().__init__(
            message=f"Concurrent modification detected for {resource}. Please retry.",
            status_code=409,
            error_code="CONCURRENT_MODIFICATION",
            details={"resource": resource},
        )
