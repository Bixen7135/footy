"""Transaction management utilities for database operations."""
from contextlib import asynccontextmanager
from typing import Literal

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession


IsolationLevel = Literal["READ COMMITTED", "REPEATABLE READ", "SERIALIZABLE"]


@asynccontextmanager
async def atomic_transaction(
    session: AsyncSession,
    isolation_level: IsolationLevel = "REPEATABLE READ",
):
    """
    Context manager for explicit transaction boundaries with configurable isolation level.

    This ensures that:
    - All operations within the context are part of a single transaction
    - The isolation level is set before any operations begin
    - The transaction is committed on success or rolled back on failure

    Usage:
        async with atomic_transaction(db, "SERIALIZABLE") as session:
            # All operations here are in a single transaction
            ...

    Args:
        session: The SQLAlchemy async session
        isolation_level: Transaction isolation level
            - "READ COMMITTED": Default PostgreSQL level, may see phantom reads
            - "REPEATABLE READ": Consistent reads within transaction, recommended for most cases
            - "SERIALIZABLE": Full isolation, may cause serialization failures

    Yields:
        The same session, wrapped in a transaction

    Raises:
        Any exception from the operations will cause a rollback
    """
    # Begin a new transaction with the specified isolation level
    # This uses raw SQL because SQLAlchemy's async session doesn't
    # directly support setting isolation level
    await session.execute(text(f"SET TRANSACTION ISOLATION LEVEL {isolation_level}"))

    try:
        yield session
        await session.commit()
    except Exception:
        await session.rollback()
        raise


@asynccontextmanager
async def nested_transaction(session: AsyncSession):
    """
    Context manager for savepoint-based nested transactions.

    Useful when you need to attempt an operation that might fail
    and want to rollback only that operation without affecting
    the outer transaction.

    Usage:
        async with atomic_transaction(db) as session:
            # Do some work...

            async with nested_transaction(session) as nested:
                # This might fail
                ...

            # Continue with outer transaction even if nested failed

    Args:
        session: The SQLAlchemy async session (must be in a transaction)

    Yields:
        The session with an active savepoint
    """
    async with session.begin_nested():
        yield session
