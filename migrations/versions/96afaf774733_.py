"""empty message

Revision ID: 96afaf774733
Revises: b8c6a3167d5d
Create Date: 2016-03-28 22:41:54.019878

"""

# revision identifiers, used by Alembic.
revision = '96afaf774733'
down_revision = 'b8c6a3167d5d'

from alembic import op
import app
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('atletas', sa.Column('tecnico', sa.String(), nullable=True))
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('atletas', 'tecnico')
    ### end Alembic commands ###
