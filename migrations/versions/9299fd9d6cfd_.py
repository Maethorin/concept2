"""empty message

Revision ID: 9299fd9d6cfd
Revises: 6d8e9e4138bf
Create Date: 2016-03-03 11:01:20.326073

"""

# revision identifiers, used by Alembic.
revision = '9299fd9d6cfd'
down_revision = '6d8e9e4138bf'

from alembic import op
import app
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('provas', sa.Column('observacao', sa.String(), nullable=True))
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('provas', 'observacao')
    ### end Alembic commands ###
