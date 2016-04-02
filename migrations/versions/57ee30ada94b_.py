"""empty message

Revision ID: 57ee30ada94b
Revises: c822a105fbfb
Create Date: 2016-04-02 16:06:33.452540

"""

# revision identifiers, used by Alembic.
revision = '57ee30ada94b'
down_revision = 'c822a105fbfb'

from alembic import op
import app
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('resultados', sa.Column('colocacao', sa.Integer(), nullable=True))
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('resultados', 'colocacao')
    ### end Alembic commands ###
