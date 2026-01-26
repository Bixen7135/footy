"""Domain layer for business logic and rules."""
from app.domain.order import (
    VALID_TRANSITIONS,
    TERMINAL_STATES,
    validate_transition,
    can_transition,
    get_allowed_transitions,
    InvalidStateTransitionError,
)

__all__ = [
    "VALID_TRANSITIONS",
    "TERMINAL_STATES",
    "validate_transition",
    "can_transition",
    "get_allowed_transitions",
    "InvalidStateTransitionError",
]
