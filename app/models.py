# -*- coding: utf-8 -*-
import csv
import os
import googlemaps
from sqlalchemy.orm import relationship
import database

db = database.AppRepository.db


class QueryMixin(object):

    @classmethod
    def obter_lista(cls, *args, **kwargs):
        return cls.query.all()

    @classmethod
    def obter_item(cls, item_id):
        return cls.query.get(item_id)


class OndeRemar(db.Model, QueryMixin):
    __tablename__ = 'onde_remar'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String())
    endereco = db.Column(db.String())
    telefone = db.Column(db.String())
    latitude = db.Column(db.Float())
    longitude = db.Column(db.Float())
    modalidade = db.Column(database.ModalidadeTipo())

    @classmethod
    def obter_lista(cls, *args, **kwargs):
        if 'modalidade' in kwargs:
            return cls.apenas_modalidades(kwargs['modalidade'])
        return super(OndeRemar, cls).obter_lista(*args, **kwargs)

    @classmethod
    def adiciona_do_csv(cls):
        csv_file = '{}/onde-remar.csv'.format(os.path.join(os.getcwd(), 'dados'))
        with open(csv_file) as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                modalidade = OndeRemar.obter_codigo_modalidade(row)
                endereco = '{}, {}, {}, Brasil'.format(row['ENDEREÇO'], row['CIDADE'], row['UF'])
                coordenadas = OndeRemar.obter_coordenadas(endereco)
                onde_remar = OndeRemar(
                    nome=row['ENTIDADE'],
                    endereco=endereco,
                    telefone=row['CONTATO'],
                    modalidade=modalidade,
                    latitude=coordenadas['lat'],
                    longitude=coordenadas['lng']
                )
                db.session.add(onde_remar)
        db.session.commit()

    @classmethod
    def obter_codigo_modalidade(cls, row):
        try:
            return [modalidade[0] for modalidade in database.MODALIDADES if
                    modalidade[1].lower() == row['TIPO'].lower()][0]
        except IndexError:
            return 'musculacao'

    @classmethod
    def obter_coordenadas(cls, endereco):
        try:
            gmaps = googlemaps.Client(key=database.config.GOOGLE_API_KEY)
            geocode = gmaps.geocode(endereco)[0]
            return geocode['geometry']['location']
        except (KeyError, IndexError):
            return {'lat': None, 'lng': None}

    @classmethod
    def apenas_modalidades(cls, modalidades):
        return OndeRemar.query.filter(OndeRemar.modalidade.in_(modalidades)).all()

    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'endereco': self.endereco,
            'telefone': self.telefone,
            'modalidade': {'codigo': self.modalidade.code, 'nome': self.modalidade.value},
            'coordenadas': {'latitude': self.latitude, 'longitude': self.longitude}
        }


class Produto(db.Model, QueryMixin):
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


class Evento(db.Model, QueryMixin):
    __tablename__ = 'eventos'
    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String())
    titulo = db.Column(db.String())
    subtitulo = db.Column(db.String())
    data_inicio = db.Column(db.Date())
    data_fim = db.Column(db.Date())
    imagem_lista = db.Column(db.String())
    imagem_destaque = db.Column(db.String())
    imagem_logo = db.Column(db.String())
    imagem_propaganda = db.Column(db.String())
    descricao = db.Column(db.String())
    em_destaque = db.Column(db.Boolean)
    provas = relationship("Prova", back_populates="evento")

    def lista_provas_dict(self):
        provas_dict = []
        for prova in self.provas:
            provas_dict.append(prova.as_dict())
        return provas_dict

    @classmethod
    def obter_item(cls, item_id):
        return cls.query.filter_by(slug=item_id).first()

    def to_dict(self):
        return {
            "id": self.id,
            "slug": self.slug,
            "titulo": self.titulo,
            "subtitulo": self.subtitulo,
            "dataInicio": {"ano": self.data_inicio.year, "mes": self.data_inicio.month, "dia": self.data_inicio.day},
            "dataFim": {"ano": self.data_fim.year, "mes": self.data_fim.month, "dia": self.data_fim.day},
            "imagemLista": self.imagem_lista,
            "imagemDestaque": self.imagem_destaque,
            "imagemLogo": self.imagem_logo,
            "imagemPropaganda": self.imagem_propaganda,
            "descricao": self.descricao,
            "destaque": self.em_destaque,
            "provas": self.lista_provas_dict()
        }


class Categoria(db.Model, QueryMixin):
    __tablename__ = 'categorias'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String())
    sub_categorias = relationship("SubCategoria", back_populates="categoria")

    @property
    def codigo(self):
        return self.nome.upper()[:3]


class SubCategoria(db.Model, QueryMixin):
    __tablename__ = 'sub_categorias'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String())
    categoria_id = db.Column(db.Integer, db.ForeignKey('categorias.id'))
    categoria = relationship("Categoria", back_populates="sub_categorias")
    provas = relationship("Prova", back_populates="sub_categoria")

    @property
    def codigo(self):
        return u'{}{}'.format(self.categoria.codigo, self.nome.upper()[:3])

    @property
    def label(self):
        return u'{} {}'.format(self.categoria.nome, self.nome)


class Prova(db.Model, QueryMixin):
    __tablename__ = 'provas'
    id = db.Column(db.Integer, primary_key=True)
    distancia = db.Column(database.DistanciaTipo())
    sexo = db.Column(database.SexoTipo())
    tipo = db.Column(database.ProvaTipo())
    revezamento = db.Column(db.Integer)
    ordem = db.Column(db.Integer)
    tempo_execucao = db.Column(db.Integer)
    data_inicio = db.Column(db.DateTime)
    observacao = db.Column(db.String())
    evento_id = db.Column(db.Integer, db.ForeignKey('eventos.id'))
    evento = relationship("Evento", back_populates="provas")
    sub_categoria_id = db.Column(db.Integer, db.ForeignKey('sub_categorias.id'))
    sub_categoria = relationship("SubCategoria", back_populates="provas")
    inscricoes = relationship("Inscricao", back_populates="prova")

    @property
    def codigo(self):
        return '{}{}{}{}'.format(
            self.distancia.code if self.distancia else '',
            self.tipo.code if self.tipo else '',
            self.sexo.code if self.sexo else '',
            self.sub_categoria.codigo if self.sub_categoria else ''
        )

    @property
    def label(self):
        distancia = '{}m '.format(self.distancia.code) if self.distancia and self.distancia.value > 0 else ''
        tipo = '{} '.format(self.tipo.value[:4]) if self.tipo else ''
        sexo = '{} '.format(self.sexo.value) if self.sexo else ''
        observacao = self.observacao if self.observacao else ''
        return '{}{}{}{}'.format(
            distancia,
            tipo,
            sexo,
            observacao
        )

    def as_dict(self):
        distancia = self.distancia.value
        tipo = self.tipo.value if self.tipo else ''
        sexo = self.sexo.value if self.sexo else ''
        sub_categoria = self.sub_categoria.label if self.sub_categoria else ''
        observacao = self.observacao if self.observacao else ''
        return {
            'id': self.id,
            'codigo': self.codigo,
            'label': self.label,
            'distancia': distancia,
            'tipo': tipo,
            'sexo': sexo,
            'subCategoria': sub_categoria,
            'observacao': observacao,
        }


class Inscricao(db.Model, QueryMixin):
    __tablename__ = 'inscricoes'
    id = db.Column(db.Integer, primary_key=True)
    atleta_id = db.Column(db.Integer, db.ForeignKey('atletas.id'))
    atleta = relationship("Atleta", back_populates="inscricoes")
    afiliacao = db.Column(db.String(15))
    nome_time = db.Column(db.String(10))
    prova_id = db.Column(db.Integer, db.ForeignKey('provas.id'))
    prova = relationship("Prova", back_populates="inscricoes")
    pedido_numero = db.Column(db.String(10))
    comprovante_pagamento = db.Column(db.String())


class Atleta(db.Model, QueryMixin):
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


# prova pode ter uma ou mais... perguntar o tempo e agrupar na bateria quem não sabe fica por último
# provas vem primeiro e as inscrições são feitas em cima das provas... filtrar provas de acordo com os dados
# quantidade de maq na prova (vai definir as baterias)
# Prova: TIPO, DISTANCIA, CATEGORIA, SEXO
# maquina recebe um nr da prova e mostra quem tá competindo junto.