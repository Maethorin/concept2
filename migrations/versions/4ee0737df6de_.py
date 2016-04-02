"""empty message

Revision ID: 4ee0737df6de
Revises: 57ee30ada94b
Create Date: 2016-04-02 18:17:59.683498

"""

# revision identifiers, used by Alembic.
revision = '4ee0737df6de'
down_revision = '57ee30ada94b'

from alembic import op
import app
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('provas', sa.Column('status', app.database.StatusProva(), nullable=True))
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('provas', 'status')
    ### end Alembic commands ###
