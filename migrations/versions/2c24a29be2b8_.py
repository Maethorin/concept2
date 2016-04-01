"""empty message

Revision ID: 2c24a29be2b8
Revises: 96afaf774733
Create Date: 2016-03-30 22:14:38.731277

"""

# revision identifiers, used by Alembic.
revision = '2c24a29be2b8'
down_revision = '96afaf774733'

from alembic import op
import app
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('inscricoes', sa.Column('esta_pago', sa.Boolean(), nullable=True))
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('inscricoes', 'esta_pago')
    ### end Alembic commands ###