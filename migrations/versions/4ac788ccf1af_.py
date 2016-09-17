"""empty message

Revision ID: 4ac788ccf1af
Revises: 95e81423cf0c
Create Date: 2016-09-17 14:19:50.753037

"""

# revision identifiers, used by Alembic.
revision = '4ac788ccf1af'
down_revision = '95e81423cf0c'

from alembic import op
import app
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('noticias', 'corpo')
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('noticias', sa.Column('corpo', sa.VARCHAR(), autoincrement=False, nullable=False))
    ### end Alembic commands ###
