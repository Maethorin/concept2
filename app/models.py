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
    prova_id = db.Column(db.Integer, db.ForeignKey('provas.id'))
    prova = relationship("Prova", back_populates="inscricoes")


class Categoria(db.Model):
    __tablename__ = 'categorias'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String())
    sub_categorias = relationship("SubCategoria", back_populates="categoria")

    def codigo(self):
        return self.nome.upper()[:3]


class SubCategoria(db.Model):
    __tablename__ = 'sub_categorias'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String())
    categoria_id = db.Column(db.Integer, db.ForeignKey('categorias.id'))
    categoria = relationship("Categoria", back_populates="sub_categorias")
    provas = relationship("Prova", back_populates="sub_categoria")

    def codigo(self):
        return '{}{}'.format(self.categoria.codigo, self.nome.upper()[:3])


class Prova(db.Model):
    __tablename__ = 'provas'
    DISTANCIA = [
        (100, 100),
        (250, 250),
        (500, 500),
        (1000, 1000),
        (1500, 1500),
        (2000, 2000),
        (2500, 2500),
        (3000, 3000),
        (4000, 4000),
        (5000, 5000),
        (6000, 6000),
        (8000, 8000),
        (10000, 10000),
        (20000, 20000),
        (42195, 42195),
    ]
    TIPOS = [
        ('I', 'Individual'),
        ('D', 'Dupla'),
        ('Q', 'Quadra'),
        ('8', '8'),
        ('R', 'Revezamento'),
        ('B', 'Biathlon'),
    ]
    SEXO = [('MA', 'Masculino'), ('FE', 'Feminino'), ('MI', 'Misto')]
    id = db.Column(db.Integer, primary_key=True)
    distancia = db.Column(db.Integer)
    sexo = db.Column(choice.ChoiceType(SEXO))
    tipo = db.Column(choice.ChoiceType(TIPOS))
    sub_categoria_id = db.Column(db.Integer, db.ForeignKey('sub_categorias.id'))
    sub_categoria = relationship("SubCategoria", back_populates="provas")

    def codigo(self):
        return '{}{}{}{}'.format(
            self.sexo, self.distancia, self.tipo, self.sub_categoria.codigo
        )

# prova pode ter uma ou mais... perguntar o tempo e agrupar na bateria quem não sabe fica por último
# provas vem primeiro e as inscrições são feitas em cima das provas... filtrar provas de acordo com os dados
# quantidade de maq na prova (vai definir as baterias)
# Prova: TIPO, DISTANCIA, CATEGORIA, SEXO
# maquina recebe um nr da prova e mostra quem tá competindo junto.