# -*- coding: utf-8 -*-
from sqlalchemy.orm import relationship
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
