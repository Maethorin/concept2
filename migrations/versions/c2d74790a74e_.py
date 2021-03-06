"""empty message

Revision ID: c2d74790a74e
Revises: dda6cfde5752
Create Date: 2016-03-14 15:03:07.746469

"""

# revision identifiers, used by Alembic.
revision = 'c2d74790a74e'
down_revision = 'dda6cfde5752'

from alembic import op
import app
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('atletas', 'celular',
               existing_type=sa.VARCHAR(length=11),
               nullable=False)
    op.alter_column('atletas', 'cpf',
               existing_type=sa.VARCHAR(length=11),
               nullable=False)
    op.alter_column('atletas', 'email',
               existing_type=sa.VARCHAR(),
               nullable=False)
    op.alter_column('atletas', 'nascimento',
               existing_type=sa.DATE(),
               nullable=False)
    op.alter_column('atletas', 'nome',
               existing_type=sa.VARCHAR(),
               nullable=False)
    op.alter_column('atletas', 'senha_hash',
               existing_type=sa.VARCHAR(length=128),
               nullable=False)
    op.alter_column('atletas', 'sexo',
               existing_type=sa.VARCHAR(length=2),
               nullable=False)
    op.alter_column('atletas', 'sobrenome',
               existing_type=sa.VARCHAR(),
               nullable=False)
    op.alter_column('categorias', 'nome',
               existing_type=sa.VARCHAR(),
               nullable=False)
    op.alter_column('eventos', 'data_fim',
               existing_type=sa.DATE(),
               nullable=False)
    op.alter_column('eventos', 'data_inicio',
               existing_type=sa.DATE(),
               nullable=False)
    op.alter_column('eventos', 'resumo',
               existing_type=sa.TEXT(),
               nullable=False)
    op.alter_column('eventos', 'slug',
               existing_type=sa.VARCHAR(),
               nullable=False)
    op.alter_column('eventos', 'titulo',
               existing_type=sa.VARCHAR(),
               nullable=False)
    op.add_column('inscricoes', sa.Column('nome_convidado', sa.String(length=120), nullable=True))
    op.add_column('inscricoes', sa.Column('nome_segundo_convidado', sa.String(length=120), nullable=True))
    op.alter_column('onde_remar', 'endereco',
               existing_type=sa.VARCHAR(),
               nullable=False)
    op.alter_column('onde_remar', 'nome',
               existing_type=sa.VARCHAR(),
               nullable=False)
    op.alter_column('onde_remar', 'telefone',
               existing_type=sa.VARCHAR(),
               nullable=False)
    op.alter_column('produtos', 'nome',
               existing_type=sa.VARCHAR(),
               nullable=False)
    op.alter_column('provas', 'distancia',
               existing_type=sa.INTEGER(),
               nullable=False)
    op.alter_column('sub_categorias', 'nome',
               existing_type=sa.VARCHAR(),
               nullable=False)
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('sub_categorias', 'nome',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.alter_column('provas', 'distancia',
               existing_type=sa.INTEGER(),
               nullable=True)
    op.alter_column('produtos', 'nome',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.alter_column('onde_remar', 'telefone',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.alter_column('onde_remar', 'nome',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.alter_column('onde_remar', 'endereco',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.drop_column('inscricoes', 'nome_segundo_convidado')
    op.drop_column('inscricoes', 'nome_convidado')
    op.alter_column('eventos', 'titulo',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.alter_column('eventos', 'slug',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.alter_column('eventos', 'resumo',
               existing_type=sa.TEXT(),
               nullable=True)
    op.alter_column('eventos', 'data_inicio',
               existing_type=sa.DATE(),
               nullable=True)
    op.alter_column('eventos', 'data_fim',
               existing_type=sa.DATE(),
               nullable=True)
    op.alter_column('categorias', 'nome',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.alter_column('atletas', 'sobrenome',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.alter_column('atletas', 'sexo',
               existing_type=sa.VARCHAR(length=2),
               nullable=True)
    op.alter_column('atletas', 'senha_hash',
               existing_type=sa.VARCHAR(length=128),
               nullable=True)
    op.alter_column('atletas', 'nome',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.alter_column('atletas', 'nascimento',
               existing_type=sa.DATE(),
               nullable=True)
    op.alter_column('atletas', 'email',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.alter_column('atletas', 'cpf',
               existing_type=sa.VARCHAR(length=11),
               nullable=True)
    op.alter_column('atletas', 'celular',
               existing_type=sa.VARCHAR(length=11),
               nullable=True)
    ### end Alembic commands ###
