"""empty message

Revision ID: 955f4593a961
Revises: 2bdf34717b73
Create Date: 2016-03-02 19:55:48.497468

"""

# revision identifiers, used by Alembic.
revision = '955f4593a961'
down_revision = '2bdf34717b73'

from alembic import op
import app
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('eventos', sa.Column('slug', sa.String(), nullable=True))
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('eventos', 'slug')
    ### end Alembic commands ###
