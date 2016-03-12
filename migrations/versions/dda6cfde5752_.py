"""empty message

Revision ID: dda6cfde5752
Revises: 7189463da035
Create Date: 2016-03-12 00:49:53.587621

"""

# revision identifiers, used by Alembic.
revision = 'dda6cfde5752'
down_revision = '7189463da035'

from alembic import op
import app
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_table('admins',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('nome', sa.String(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('senha_hash', sa.String(length=128), nullable=False),
    sa.Column('ativo', sa.Boolean(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('admins')
    ### end Alembic commands ###
