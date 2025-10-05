"""merge heads

Revision ID: 8cbac8b17585
Revises: 001, 53b5b76f9f3b
Create Date: 2025-10-05 15:04:43.459523

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8cbac8b17585'
down_revision = ('001', '53b5b76f9f3b')
branch_labels = None
depends_on = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass