# -*- coding: utf-8 -*-
from sqlalchemy.orm import relationship
from sqlalchemy_utils.types import choice
from database import AppRepository

db = AppRepository.db


class Produto(db.Model):
    __tablename__ = 'produtos'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String())
    imagem = db.Column(db.String())
    descricao = db.Column(db.String())

    @classmethod
    def cria_produto(cls, produto_dict):
        produto = cls(
            nome=produto_dict['nome'],
            imagem=produto_dict['imagem'],
            descricao=produto_dict['descricao'],
        )
        db.session.add(produto)
        db.session.commit()
        return produto

    @classmethod
    def edita_produto(cls, produto_dict):
        produto = cls.query.get(produto_dict['id'])
        produto.nome = produto_dict['nome']
        produto.imagem = produto_dict['imagem']
        produto.descricao = produto_dict['descricao']
        db.session.commit()
        return produto

    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'imagem': self.imagem,
            'descricao': self.descricao
        }


class Evento(db.Model):
    __tablename__ = 'eventos'
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String())
    subtitulo = db.Column(db.String())
    imagem_lista = db.Column(db.String())
    imagem_destaque = db.Column(db.String())
    imagem_logo = db.Column(db.String())
    imagem_propaganda = db.Column(db.String())
    descricao = db.Column(db.String())
    fundo = db.Column(db.String())
    href_link = db.Column(db.String())
    nome_link = db.Column(db.String())
    em_destaque = db.Column(db.Boolean())

    def to_dict(self):
        return {
            "id": self.id,
            "titulo": self.titulo,
            "subtitulo": self.subtitulo,
            "imagemLista": self.imagem_lista,
            "imagemDestaque": self.imagem_destaque,
            "imagemLogo": self.imagem_logo,
            "imagemPropaganda": self.imagem_propaganda,
            "descricao": self.descricao,
            "fundo": self.fundo,
            "hrefLink": self.href_link,
            "nomeLink": self.nome_link,
            "destaque": self.em_destaque,
        }


class Atleta(db.Model):
    __tablename__ = 'atletas'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String())
    nome = db.Column(db.String())
    sobrenome = db.Column(db.String())
    sexo = db.Column(db.String(1))
    cpf = db.Column(db.String(11))
    telefone = db.Column(db.String(10))
    celular = db.Column(db.String(11))
    nascimento = db.Column(db.Date())
    inscricoes = relationship("Inscricao", back_populates="atleta")


class Inscricao(db.Model):
    __tablename__ = 'inscricoes'
    id = db.Column(db.Integer, primary_key=True)
    atleta_id = db.Column(db.Integer, db.ForeignKey('atletas.id'))
    atleta = relationship("Atleta", back_populates="inscricoes")
    afiliacao = db.Column(db.String(15))
    nome_time = db.Column(db.String(10))


class Categoria(db.Model):
    __tablename__ = 'categorias'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String())
    sub_categorias = relationship("SubCategoria", back_populates="categoria")


class SubCategoria(db.Model):
    __tablename__ = 'sub_categorias'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String())
    categoria_id = db.Column(db.Integer, db.ForeignKey('categorias.id'))
    categoria = relationship("Categoria", back_populates="sub_categorias")
    provas = relationship("Prova", back_populates="sub_categoria")


class Prova(db.Model):
    __tablename__ = 'provas'
    TIPOS = [
        ('I', 'Individual'),
        ('D', 'Dupla'),
        ('Q', 'Quadra'),
        ('8', '8'),
        ('R', 'Revezamento'),
        ('B', 'Biathlon'),
    ]
    id = db.Column(db.Integer, primary_key=True)
    sexo = db.Column(db.String(2))
    tipo = db.Column(choice.ChoiceType(TIPOS))
    sub_categoria_id = db.Column(db.Integer, db.ForeignKey('sub_categorias.id'))
    sub_categoria = relationship("SubCategoria", back_populates="provas")

