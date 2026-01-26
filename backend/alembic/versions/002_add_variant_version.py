"""Add version column to product_variants for optimistic locking

Revision ID: 002_variant_version
Revises: 001_initial
Create Date: 2024-01-15 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '002_variant_version'
down_revision: Union[str, None] = '001_initial'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add version column for optimistic locking during stock updates
    op.add_column(
        'product_variants',
        sa.Column('version', sa.Integer(), nullable=False, server_default='1')
    )


def downgrade() -> None:
    op.drop_column('product_variants', 'version')
