"""Order domain logic - state machine and business rules."""
from app.models.order import OrderStatus
from app.core.exceptions import FootyException


class InvalidStateTransitionError(FootyException):
    """Raised when an invalid order state transition is attempted."""

    def __init__(self, current: OrderStatus, target: OrderStatus):
        super().__init__(
            message=f"Cannot transition from {current.value} to {target.value}",
            status_code=400,
            error_code="INVALID_STATE_TRANSITION",
            details={
                "current_status": current.value,
                "target_status": target.value,
            },
        )


# Terminal states - orders in these states cannot transition further
TERMINAL_STATES = {OrderStatus.DELIVERED, OrderStatus.CANCELLED}

# Valid state transitions map
# Key: current state, Value: set of allowed target states
VALID_TRANSITIONS: dict[OrderStatus, set[OrderStatus]] = {
    OrderStatus.PENDING: {OrderStatus.CONFIRMED, OrderStatus.CANCELLED},
    OrderStatus.CONFIRMED: {OrderStatus.PROCESSING, OrderStatus.CANCELLED},
    OrderStatus.PROCESSING: {OrderStatus.SHIPPED, OrderStatus.CANCELLED},
    OrderStatus.SHIPPED: {OrderStatus.DELIVERED},
    OrderStatus.DELIVERED: set(),  # Terminal state
    OrderStatus.CANCELLED: set(),  # Terminal state
}


def validate_transition(current: OrderStatus, target: OrderStatus) -> None:
    """
    Validate that a state transition is allowed.

    Args:
        current: The current order status
        target: The desired target status

    Raises:
        InvalidStateTransitionError: If the transition is not allowed
    """
    if current in TERMINAL_STATES:
        raise InvalidStateTransitionError(current, target)

    allowed_targets = VALID_TRANSITIONS.get(current, set())
    if target not in allowed_targets:
        raise InvalidStateTransitionError(current, target)


def can_transition(current: OrderStatus, target: OrderStatus) -> bool:
    """
    Check if a state transition is allowed without raising an exception.

    Args:
        current: The current order status
        target: The desired target status

    Returns:
        True if the transition is allowed, False otherwise
    """
    if current in TERMINAL_STATES:
        return False

    allowed_targets = VALID_TRANSITIONS.get(current, set())
    return target in allowed_targets


def get_allowed_transitions(current: OrderStatus) -> set[OrderStatus]:
    """
    Get the set of allowed target states for a given current state.

    Args:
        current: The current order status

    Returns:
        Set of OrderStatus values that can be transitioned to
    """
    if current in TERMINAL_STATES:
        return set()
    return VALID_TRANSITIONS.get(current, set())
