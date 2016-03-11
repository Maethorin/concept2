"""empty message

Revision ID: 7189463da035
Revises: 9f0fa98ec79d
Create Date: 2016-03-09 23:58:30.015784

"""

# revision identifiers, used by Alembic.
revision = '7189463da035'
down_revision = '9f0fa98ec79d'

from alembic import op
import app
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('sub_categorias', sa.Column('limite_maximo', sa.Integer(), nullable=True))
    op.add_column('sub_categorias', sa.Column('limite_minimo', sa.Integer(), nullable=True))
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('sub_categorias', 'limite_minimo')
    op.drop_column('sub_categorias', 'limite_maximo')
    ### end Alembic commands ###
