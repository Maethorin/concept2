# -*- coding: utf-8 -*-
import csv
import os
from StringIO import StringIO
from datetime import datetime, timedelta

import googlemaps
import jwt
from sqlalchemy import desc
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import relationship
from sqlalchemy.dialects import postgresql
from passlib.apps import custom_app_context
import unicodedata

import database

db = database.AppRepository.db


class QueryMixin(object):

    class JaExiste(Exception):
        pass

    @classmethod
    def filtrar(cls, **kwargs):
        return cls.query.filter_by(**kwargs)

    @classmethod
    def obter_lista(cls, *args, **kwargs):
        return cls.query.all()

    @classmethod
    def obter_item(cls, item_id):
        return cls.query.get(item_id)

    @classmethod
    def remover(cls, item_id):
        item = cls.obter_item(item_id)
        db.session.delete(item)
        db.session.commit()

    @classmethod
    def slugify(cls, value):
        slug = unicodedata.normalize('NFKD', value)
        slug = slug.replace(' ', '-')
        slug = slug.encode('ascii', 'ignore').lower()
        return slug

    def save_db(self):
        db.session.add(self)
        db.session.commit()


class AutenticMixin(object):
    def hash_senha(self, password):
        self.senha_hash = custom_app_context.encrypt(password)

    def verifica_senha(self, password):
        return custom_app_context.verify(password, self.senha_hash)

    def gera_token_aut(self, expiration=3600):
        return jwt.encode({'id': self.id, 'exp': datetime.utcnow() + timedelta(seconds=expiration)}, database.config.SECRET_KEY, algorithm='HS256')

    @classmethod
    def verifica_token_aut(cls, token):
        try:
            data = jwt.decode(token, database.config.SECRET_KEY)
        except:
            return None
        if not data['id']:
            return None
        user = cls.query.get(data['id'])
        return user

    @classmethod
    def obter_pelo_email(cls, email):
        return cls.query.filter_by(email=email).first()

    @property
    def eh_admin(self):
        return False


class Admin(db.Model, AutenticMixin):
    __tablename__ = 'admins'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(), nullable=False)
    email = db.Column(db.String(), unique=True, nullable=False)
    senha_hash = db.Column(db.String(128), nullable=False)
    ativo = db.Column(db.Boolean)

    @property
    def eh_admin(self):
        return True


class OndeRemar(db.Model, QueryMixin):
    __tablename__ = 'onde_remar'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(), nullable=False)
    endereco = db.Column(db.String(), nullable=False)
    telefone = db.Column(db.String(), nullable=False)
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

    def as_dict(self):
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
    nome = db.Column(db.String(), nullable=False)
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

    def as_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'imagem': self.imagem,
            'descricao': self.descricao
        }


class Evento(db.Model, QueryMixin):
    __tablename__ = 'eventos'
    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(), nullable=False)
    titulo = db.Column(db.String(), nullable=False)
    subtitulo = db.Column(db.String())
    data_inicio = db.Column(db.Date(), nullable=False)
    data_fim = db.Column(db.Date(), nullable=False)
    imagem_lista = db.Column(db.String())
    imagem_destaque = db.Column(db.String())
    imagem_logo = db.Column(db.String())
    imagem_propaganda = db.Column(db.String())
    descricao = db.Column(db.Text())
    resumo = db.Column(db.Text(), nullable=False)
    em_destaque = db.Column(db.Boolean)
    pontuacao = db.Column(postgresql.JSON)
    provas = relationship('Prova', back_populates='evento')
    cursos = db.relationship('Curso', back_populates='evento')
    inscricoes = db.relationship('Inscricao', back_populates='evento')
    url_pagamento_provas = db.Column(db.String())
    url_pagamento_cursos = db.Column(db.String())

    def lista_provas_dict(self):
        provas_dict = []
        for prova in self.provas:
            provas_dict.append(prova.as_dict())
        return provas_dict

    @classmethod
    def obter_item(cls, item_id):
        return cls.query.filter_by(slug=item_id).first()

    def as_dict(self):
        return {
            'id': self.id,
            'slug': self.slug,
            'titulo': self.titulo,
            'sub_titulo': self.subtitulo,
            'data_inicio': {'ano': self.data_inicio.year, 'mes': self.data_inicio.month, 'dia': self.data_inicio.day},
            'data_fim': {'ano': self.data_fim.year, 'mes': self.data_fim.month, 'dia': self.data_fim.day},
            'data_inicio_completa': self.data_inicio.strftime('%Y-%m-%dT%H:%M:%S'),
            'data_fim_completa': self.data_fim.strftime('%Y-%m-%dT%H:%M:%S'),
            'imagem_lista': self.imagem_lista,
            'imagem_destaque': self.imagem_destaque,
            'imagem_logo': self.imagem_logo,
            'imagem_propaganda': self.imagem_propaganda,
            'descricao': self.descricao,
            'destaque': self.em_destaque,
            'provas': self.lista_provas_dict(),
            'pontuacao': self.pontuacao,
            'resumo': self.resumo,
            'url_pagamento_provas': self.url_pagamento_provas,
            'url_pagamento_cursos': self.url_pagamento_cursos,
            'cursos': [curso.as_dict() for curso in self.cursos],
            'inscricoes': [inscricao.as_dict() for inscricao in self.inscricoes]
        }

    @classmethod
    def atribui_valores(cls, evento, json_data):
        evento.titulo = json_data.get('titulo', evento.titulo)
        evento.slug = cls.slugify(evento.titulo)
        evento.subtitulo = json_data.get('sub_titulo', evento.subtitulo)
        evento.descricao = json_data.get('descricao', evento.descricao)
        data_inicio_str = json_data.get('data_inicio_completa', evento.data_fim.strftime('%Y-%m-%dT%H:%M:%S.%fZ'))
        data_inicio_str = data_inicio_str.split('T')[0]
        data_inicio = datetime.strptime(data_inicio_str, '%Y-%m-%d')
        evento.data_inicio = data_inicio
        data_fim_str = json_data.get('data_fim_completa', evento.data_fim.strftime('%Y-%m-%dT%H:%M:%S.%fZ'))
        data_fim_str = data_fim_str.split('T')[0]
        data_fim = datetime.strptime(data_fim_str, '%Y-%m-%d')
        evento.data_fim = data_fim
        evento.resumo = json_data.get('resumo', evento.resumo)
        evento.pontuacao = json_data.get('pontuacao', evento.pontuacao)
        imagem_url = json_data.get('imagem_url', None)
        if imagem_url:
            imagens_urls = evento.imagens_urls.split('|') if evento.imagens_urls else []
            last_part = imagem_url.split('/')[-1]
            if last_part not in [_imagem.split('/')[-1] for _imagem in imagens_urls]:
                imagens_urls.append(imagem_url)
            evento.imagens_urls = '|'.join(imagens_urls)

    @classmethod
    def atualizar_de_json(cls, item_id, json_data):
        evento = cls.obter_item(item_id)
        cls.atribui_valores(evento, json_data)
        if json_data.get('publicado', False):
            evento.data_publicacao = datetime.now()
        evento.save_db()
        return evento


class Categoria(db.Model, QueryMixin):
    __tablename__ = 'categorias'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(), nullable=False)
    sub_categorias = relationship('SubCategoria', back_populates='categoria')

    @property
    def codigo(self):
        return self.nome.upper()[:3]

    def as_dict(self):
        return {
            'nome': self.nome,
            'codigo': self.codigo
        }


class SubCategoria(db.Model, QueryMixin):
    __tablename__ = 'sub_categorias'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(), nullable=False)
    categoria_id = db.Column(db.Integer, db.ForeignKey('categorias.id'))
    categoria = relationship('Categoria', back_populates='sub_categorias')
    provas = relationship('Prova', back_populates='sub_categoria')
    limite_minimo = db.Column(db.Integer)
    limite_maximo = db.Column(db.Integer)

    @property
    def codigo(self):
        return u'{}{}'.format(self.categoria.codigo, self.nome.upper()[:3])

    @property
    def label(self):
        return u'{} {}'.format(self.categoria.nome, self.nome)

    def as_dict(self):
        return {
            'nome': self.nome,
            'codigo': self.codigo,
            'label': self.label,
            'limiteMinimo': self.limite_minimo,
            'limiteMaximo': self.limite_maximo,
            'categoria': self.categoria.as_dict()
        }

prova_inscricao = db.Table(
    'provas_inscricoes',
    db.Column('prova_id', db.Integer, db.ForeignKey('provas.id'), nullable=False),
    db.Column('inscricao_id', db.Integer, db.ForeignKey('inscricoes.id'), nullable=False),
    db.PrimaryKeyConstraint('prova_id', 'inscricao_id')
)

curso_inscricao = db.Table(
    'cursos_inscricoes',
    db.Column('curso_id', db.Integer, db.ForeignKey('cursos.id'), nullable=False),
    db.Column('inscricao_id', db.Integer, db.ForeignKey('inscricoes.id'), nullable=False),
    db.PrimaryKeyConstraint('curso_id', 'inscricao_id')
)


class Curso(db.Model, QueryMixin):
    __tablename__ = 'cursos'
    __mapper_args__ = {
        'order_by': 'data_inicio'
    }
    id = db.Column(db.Integer, primary_key=True)
    evento_id = db.Column(db.Integer, db.ForeignKey('eventos.id'))
    evento = relationship('Evento', back_populates='cursos')
    inscricoes = db.relationship('Inscricao', secondary=curso_inscricao, backref='cursos')
    nome = db.Column(db.String())
    data_inicio = db.Column(db.DateTime)
    duracao = db.Column(db.Integer)
    valor = db.Column(db.Integer)
    url_pagamento = db.Column(db.String())

    def as_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'dia': self.data_inicio.strftime('%d/%m'),
            'hora': self.data_inicio.strftime('%H:%M'),
            'duracao': self.duracao,
            'urlPagamento': self.url_pagamento,
            'valor': self.valor
        }


class Resultado(db.Model, QueryMixin):
    __tablename__ = 'resultados'
    __mapper_args__ = {
        'order_by': 'colocacao'
    }
    id = db.Column(db.Integer, primary_key=True)
    prova_id = db.Column(db.Integer, db.ForeignKey('provas.id'))
    prova = relationship('Prova', back_populates='resultados')
    atleta_nome = db.Column(db.String)
    atleta_id = db.Column(db.Integer, db.ForeignKey('atletas.id'))
    atleta = relationship('Atleta', back_populates='resultados')
    tempo = db.Column(db.String)
    pontuacao = db.Column(db.Integer)
    colocacao = db.Column(db.Integer)

    @property
    def inscricao(self):
        for inscricao in self.prova.inscricoes:
            if self.atleta_id == inscricao.atleta_id:
                return inscricao

    @classmethod
    def ler_resultados_do_arquivo(cls, stream, evento_slug):
        conteudo = stream.read().replace('\r', '').split('\n')
        colocacoes = []
        for linha in conteudo[3:]:
            if linha:
                if linha == 'Detailed Results':
                    break
                colocacoes.append(linha)
        como_stream = StringIO('\n'.join(colocacoes))
        reader = csv.DictReader(como_stream)
        evento = Evento.query.filter_by(slug=evento_slug).first()
        provas = Prova.query.filter_by(evento_id=evento.id).all()
        for row in reader:
            resultado = Resultado()
            db.session.add(resultado)
            atleta = Atleta.query.get(row['Bib Number'])
            if atleta:
                resultado.atleta = atleta
            resultado.atleta_nome = row['Boat/Team Name']
            resultado.prova = [prova for prova in provas if prova.codigo == row['Class']][0]
            resultado.colocacao = int(row['Place'])
            resultado.tempo = row['Time Rowed']
        db.session.commit()
        return colocacoes


    @classmethod
    def obter_lista(cls, evento_slug):
        resultados = []
        evento = Evento.query.filter_by(slug=evento_slug).first()
        agora = datetime.now()
        for prova in evento.provas:
            if prova.distancia == 0:
                continue
            if prova.status and prova.status.code == 'NA':
                continue
            status = u'Pronto' if len(prova.resultados) > 0 else u'Em Apuração' if agora > prova.data_inicio else u'Prova Prevista'
            resultados.append({
                'prova': prova.as_dict(),
                'resultados': [resultado.as_dict() for resultado in prova.resultados],
                'status': status,
            })
        return resultados

    def as_dict(self):
        return {
            'atleta': self.atleta.as_dict(soh_atleta=True) if self.atleta else {},
            'atletaNome': self.atleta_nome,
            'inscricao': self.inscricao.as_dict() if self.inscricao else {},
            'tempo': self.tempo,
            'pontuacao': self.pontuacao
        }


class Prova(db.Model, QueryMixin):
    __tablename__ = 'provas'
    __mapper_args__ = {
        'order_by': 'data_inicio, distancia, tipo, sexo DESC'
    }
    id = db.Column(db.Integer, primary_key=True)
    distancia = db.Column(db.Integer, nullable=False)
    sexo = db.Column(database.SexoTipo())
    tipo = db.Column(database.ProvaTipo())
    status = db.Column(database.StatusProva())
    revezamento = db.Column(db.Integer)
    ordem = db.Column(db.Integer)
    tempo_execucao = db.Column(db.Integer)
    data_inicio = db.Column(db.DateTime)
    observacao = db.Column(db.String())
    evento_id = db.Column(db.Integer, db.ForeignKey('eventos.id'))
    evento = relationship('Evento', back_populates='provas')
    sub_categoria_id = db.Column(db.Integer, db.ForeignKey('sub_categorias.id'))
    sub_categoria = relationship('SubCategoria', back_populates='provas')
    inscricoes = db.relationship('Inscricao', secondary=prova_inscricao, backref='provas')
    resultados = relationship('Resultado', back_populates='prova')
    MODELO_TIME = """{nomeInscricao}
{atletaId}
{label}"""
    MODELO_ATLETA = """{nomeInscricao}
{atletaId}
{codigoProva}
BRA
{nascimento}
"""
    MODELO_ARQUIVO = """RACE
108
{tipo}
{label}
{distancia}
0
0
1
50
30
{numeroBarcos}
{atletas}
"""
    DE_PARA_TIPO = {'I': 0, 'D': 1, 'Q': 2, '8': 3, 'R': 2}
    DE_PARA_TAMANHO = {'I': 0, 'D': 2, 'Q': 4, '8': 8, 'R': 2}

    @classmethod
    def gera_arquivo_texto(cls, total_barco=8):
        arquivos = {}
        for prova in Prova.query.all():
            if prova.inscricoes:
                atletas = []
                for inscricao in prova.inscricoes:
                    if not inscricao.esta_pago:
                        continue
                    nome = cls.slugify(inscricao.nome_time or inscricao.atleta.nome_completo).upper()
                    if nome == 'CFVV':
                        nome = cls.slugify(u"{} - {}".format(inscricao.atleta.nome_completo, 'CFVV')).upper()
                    atletas.append(
                        cls.MODELO_ATLETA.format(**{
                            'nomeInscricao': nome,
                            'atletaId': inscricao.atleta.id,
                            'codigoProva': prova.codigo,
                            'nascimento': inscricao.atleta.nascimento.strftime('%m%d%Y')
                        })
                    )
                if not atletas:
                    continue
                corrida = {
                    'tipo': cls.DE_PARA_TIPO[prova.tipo.code],
                    'label': prova.label,
                    'distancia': prova.distancia,
                    'numeroBarcos': total_barco,
                    'atletas': ''.join(atletas)
                }
                arquivos[prova.codigo] = (cls.MODELO_ARQUIVO.format(**corrida))
        return arquivos

    @classmethod
    def atualiza_status(cls, prova_id, codigo_status):
        prova = Prova.query.get(prova_id)
        if not prova:
            raise ValueError
        prova.status = codigo_status
        db.session.add(prova)
        db.session.commit()
        return prova

    @property
    def codigo(self):
        return '{}{}{}{}'.format(
            self.distancia if self.distancia else '',
            self.tipo.code if self.tipo else '',
            self.sexo.code if self.sexo else '',
            self.sub_categoria.codigo if self.sub_categoria else ''
        )

    @property
    def label(self):
        distancia = '{}m '.format(self.distancia) if self.distancia and self.distancia > 0 else ''
        tipo = '{} '.format(self.tipo.value[:4]) if self.tipo else ''
        sexo = '{} '.format(self.sexo.value) if self.sexo else ''
        return '{}{}{}'.format(
            distancia,
            tipo,
            sexo
        )

    def as_dict(self):
        distancia = self.distancia
        tipo = self.tipo.value if self.tipo else ''
        sexo = self.sexo.value if self.sexo else ''
        status = self.status.value if self.status else 'Aguardando'
        codigo_status = self.status.code if self.status else 'AG'
        observacao = self.observacao if self.observacao else ''
        sub_categoria = self.sub_categoria.as_dict() if self.sub_categoria else {}
        return {
            'id': self.id,
            'codigo': self.codigo,
            'label': self.label,
            'dia': self.data_inicio.strftime('%d/%m'),
            'hora': self.data_inicio.strftime('%H:%M'),
            'distancia': distancia,
            'tipo': tipo,
            'sexo': sexo,
            'status': status,
            'codigoStatus': codigo_status,
            'subCategoria': sub_categoria,
            'observacao': observacao,
        }


class Inscricao(db.Model, QueryMixin):
    __tablename__ = 'inscricoes'
    id = db.Column(db.Integer, primary_key=True)
    atleta_id = db.Column(db.Integer, db.ForeignKey('atletas.id'))
    atleta = relationship('Atleta', back_populates='inscricoes')
    evento_id = db.Column(db.Integer, db.ForeignKey('eventos.id'))
    evento = relationship('Evento', back_populates='inscricoes')
    tipo_afiliacao = db.Column(database.AfiliacaoTipo())
    afiliacao = db.Column(db.String(120))
    nome_time = db.Column(db.String(120))
    pedido_numero = db.Column(db.String(10))
    nome_convidado = db.Column(db.String(120))
    nome_segundo_convidado = db.Column(db.String(120))
    comprovante_pagamento = db.Column(db.String())
    esta_pago = db.Column(db.Boolean())

    @classmethod
    def obter_inscricoes(cls):
        return cls.obter_lista()

    @classmethod
    def define_dados_de_dicionario(cls, inscricao_dict, atleta, inscricao=None):
        if not inscricao:
            inscricao = cls()
        inscricao.atleta = atleta
        inscricao.afiliacao = inscricao_dict.get('afiliacao')
        inscricao.tipo_afiliacao = inscricao_dict.get('tipoAfiliacao')
        inscricao.nome_time = inscricao_dict.get('nomeTime')
        inscricao.nome_convidado = inscricao_dict.get('nomeConvidado')
        inscricao.nome_segundo_convidado = inscricao_dict.get('nomeSegundoConvidado')
        inscricao.pedido_numero = inscricao_dict.get('pedidoNumero')
        inscricao.evento_id = inscricao_dict.get('eventoId')
        for prova in inscricao_dict['provas']:
            if 'id' in prova:
                inscricao.provas.append(Prova.query.get(prova['id']))
            else:
                for prova_banco in Prova.query.all():
                    if prova_banco.codigo == prova['codigo']:
                        inscricao.provas.append(prova_banco)
        for curso in inscricao_dict['cursos']:
            inscricao.cursos.append(Curso.query.get(curso['id']))
        return inscricao

    @classmethod
    def atualiza_de_dicionario(cls, inscricao_id, inscricao_dict, atleta, commit=False):
        inscricao = cls.query.get(inscricao_id)
        inscricao.provas = []
        inscricao.cursos = []
        inscricao = cls.define_dados_de_dicionario(inscricao_dict, atleta, inscricao)
        db.session.add(inscricao)
        if commit:
            db.session.commit()
        return inscricao

    @classmethod
    def cria_de_dicionario(cls, inscricao_dict, atleta, commit=False):
        inscricao = cls.define_dados_de_dicionario(inscricao_dict, atleta)
        db.session.add(inscricao)
        if commit:
            db.session.commit()
        return inscricao

    @classmethod
    def define_pagamento(cls, inscricao_id, esta_pago):
        inscricao = cls.query.get(inscricao_id)
        inscricao.esta_pago = esta_pago
        db.session.add(inscricao)
        db.session.commit()
        return inscricao

    def as_dict(self):
        return {
            'id': self.id,
            'tipoAfiliacao': self.tipo_afiliacao.code if self.tipo_afiliacao else '',
            'afiliacao': self.afiliacao,
            'nomeTime': self.nome_time,
            'nomeConvidado': self.nome_convidado,
            'nomeSegundoConvidado': self.nome_segundo_convidado,
            'pedidoNumero': self.pedido_numero,
            'estahPago': self.esta_pago,
            'eventoId': self.evento_id,
            'provas': [prova.as_dict() for prova in self.provas],
            'cursos': [curso.as_dict() for curso in self.cursos],
            'atleta': self.atleta.as_dict(soh_atleta=True)
        }


class EmailJaExiste(Exception):
    pass


class ErroDados(Exception):
    pass


class Atleta(db.Model, QueryMixin, AutenticMixin):
    __tablename__ = 'atletas'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(), unique=True, nullable=False)
    tecnico = db.Column(db.String())
    senha_hash = db.Column(db.String(128), nullable=False)
    nome = db.Column(db.String(), nullable=False)
    sobrenome = db.Column(db.String(), nullable=False)
    sexo = db.Column(db.String(2), nullable=False)
    cpf = db.Column(db.String(11), nullable=False)
    telefone = db.Column(db.String(10))
    celular = db.Column(db.String(11), nullable=False)
    nascimento = db.Column(db.Date(), nullable=False)
    inscricoes = relationship('Inscricao', back_populates='atleta')
    resultados = relationship('Resultado', back_populates='atleta')

    def as_dict(self, soh_atleta=False):
        atleta_dict = {
            'id': self.id,
            'email': self.email,
            'nome_completo': self.nome_completo,
            'nome': self.nome,
            'sobrenome': self.sobrenome,
            'sexo': self.sexo,
            'cpf': self.cpf,
            'telefone': self.telefone,
            'celular': self.celular,
            'nascimento': self.nascimento.strftime('%d/%m/%Y')
        }
        if not soh_atleta:
            if hasattr(self, 'inscricao'):
                atleta_dict['inscricao'] = self.inscricao.as_dict()
            else:
                atleta_dict['inscricoes'] = [inscricao.as_dict() for inscricao in self.inscricoes]
        return atleta_dict

    @property
    def nome_completo(self):
        return ' '.join([self.nome, self.sobrenome])

    @classmethod
    def obter_atleta(cls, atleta_id):
        return cls.query.get(atleta_id)

    @classmethod
    def define_dados_de_dicionario(cls, dados_dict, atleta=None):
        if not atleta:
            atleta = cls()
        atleta.email = dados_dict['email']
        atleta.nome = dados_dict['nome']
        atleta.sobrenome = dados_dict['sobrenome']
        atleta.sexo = dados_dict['sexo']
        atleta.cpf = dados_dict['cpf']
        atleta.telefone = dados_dict.get('telefone', None)
        atleta.celular = dados_dict['celular']
        atleta.nascimento = '{}-{}-{}'.format(dados_dict['nascimento'][4:], dados_dict['nascimento'][2:4], dados_dict['nascimento'][:2])
        return atleta

    @classmethod
    def atualiza_de_dicionario(cls, atleta_id, dados_dict):
        atleta = cls.query.get(atleta_id)

    @classmethod
    def cria_de_dicionario(cls, dados_dict, com_senha=True, tecnico=None):
        with db.session.no_autoflush:
            atleta = cls.define_dados_de_dicionario(dados_dict)
            if tecnico:
                atleta.tecnico = tecnico
            if com_senha:
                atleta.hash_senha(dados_dict['senha'])
            else:
                atleta.hash_senha('1q2w3e!Q@W#E')
            db.session.add(atleta)
            atleta.cria_inscricao_de_dicionario(dados_dict['inscricao'])
            try:
                db.session.commit()
            except IntegrityError as ex:
                if 'atletas_email' in str(ex):
                    raise EmailJaExiste(u'Email já está cadastrado como atleta.')
            return atleta

    @classmethod
    def obter_atleta_com_inscricao_para_o_evento(cls, atleta_id, evento_slug, atleta=None):
        if not atleta:
            atleta = cls.query.get(atleta_id)
        atleta.inscricao = None
        for inscricao in atleta.inscricoes:
            if atleta.inscricao is not None:
                break
            for prova in inscricao.provas:
                if prova.evento.slug == evento_slug:
                    atleta.inscricao = inscricao
                    break
            for curso in inscricao.cursos:
                if curso.evento.slug == evento_slug:
                    atleta.inscricao = inscricao
                    break
        return atleta

    @classmethod
    def lista_de_atletas_de_csv(cls, csv_stream, evento_id):
        reader = csv.DictReader(csv_stream)
        lista_atletas = []
        lista_erros = []
        for row in reader:
            if not row['email'] or not row['nome'] or not row['sobrenome'] or not row['cpf'] or not row['celular'] or not row['nascimento']:
                lista_erros.append(row)
                continue
            row['cpf'] = row['cpf'].replace(' ', '').replace('.', '').replace('-', '')
            row['telefone'] = row['telefone'].replace(' ', '').replace('(', '').replace(')', '').replace('-', '')
            row['celular'] = row['celular'].replace(' ', '').replace('(', '').replace(')', '').replace('-', '')
            row['nascimento'] = row['nascimento'].replace(' ', '').replace('/', '')
            row['inscricao'] = {
                'tipoAfiliacao': row['tipoAfiliacao'],
                'afiliacao': row['afiliacao'],
                'nomeTime': row['nomeTime'],
                'nomeConvidado': row['nomeConvidado'],
                'nomeSegundoConvidado': row['nomeSegundoConvidado'],
                'pedidoNumero': row['pedidoNumero'],
                'eventoId': evento_id,
                'cursos': [],
                'provas': [{'codigo': codigo} for codigo in row['provas'].split('#')]
            }
            lista_atletas.append(row)
        return lista_atletas, lista_erros

    def cria_inscricao_de_dicionario(self, inscricao_dict, commit=False):
        Inscricao.cria_de_dicionario(inscricao_dict, self)
        if commit:
            db.session.commit()

    def atualiza_inscricao_de_dicionario(self, inscricao_id, inscricao_dict):
        Inscricao.atualiza_de_dicionario(inscricao_id, inscricao_dict, self)
        db.session.commit()


class Noticia(db.Model, QueryMixin):
    __tablename__ = 'noticias'

    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(), nullable=False)
    slug = db.Column(db.String(), nullable=False, unique=True)
    resumo = db.Column(db.String(), nullable=False)
    thumbnail_url = db.Column(db.String())
    imagens_urls = db.Column(db.Text())
    corpo = db.Column(db.Text(), nullable=False)
    publicado = db.Column(db.Boolean)
    data_publicacao = db.Column(db.DateTime)

    __mapper_args__ = {
        "order_by": desc(data_publicacao)
    }

    @classmethod
    def atribui_valores(cls, noticia, json_data):
        noticia.titulo = json_data.get('titulo', noticia.titulo)
        noticia.slug = cls.slugify(noticia.titulo)[:30]
        noticia.resumo = json_data.get('resumo', noticia.resumo)
        noticia.corpo = json_data.get('corpo', noticia.corpo)
        noticia.publicado = json_data.get('publicado', noticia.publicado)
        noticia.thumbnail_url = json_data.get('thumbnail_url', noticia.thumbnail_url)
        imagem_url = json_data.get('imagem_url', None)
        if imagem_url:
            imagens_urls = noticia.imagens_urls.split('|') if noticia.imagens_urls else []
            last_part = imagem_url.split('/')[-1]
            if last_part not in [_imagem.split('/')[-1] for _imagem in imagens_urls]:
                imagens_urls.append(imagem_url)
            noticia.imagens_urls = '|'.join(imagens_urls)

    @classmethod
    def obter_item(cls, item_id):
        try:
            item_id = int(item_id)
            return super(Noticia, cls).obter_item(item_id)
        except ValueError:
            return cls.filtrar(slug=item_id)[0]

    @classmethod
    def criar_de_json(cls, json_data):
        noticia = cls()
        cls.atribui_valores(noticia, json_data)
        noticia.save_db()
        return noticia

    @classmethod
    def atualizar_de_json(cls, item_id, json_data):
        noticia = cls.obter_item(item_id)
        cls.atribui_valores(noticia, json_data)
        if json_data.get('publicado', False):
            noticia.data_publicacao = datetime.now()
        noticia.save_db()
        return noticia

    @classmethod
    def remover_imagem(cls, item_id, nome):
        # url = '/media/noticias/{}/{}'.format(item_id, url)
        noticia = cls.obter_item(item_id)
        imagens_urls = noticia.imagens_urls.split('|') if noticia.imagens_urls else []
        imagem_url = [_imagem for _imagem in imagens_urls if _imagem.split('/')[-1] == nome]
        imagem_url = imagem_url[0] if len(imagem_url) > 0 else None
        if imagem_url:
            imagens_urls.remove(imagem_url)
            noticia.imagens_urls = '|'.join(imagens_urls)
            noticia.save_db()
        return imagem_url

    def as_dict(self):
        return {
            'id': self.id,
            'titulo': self.titulo,
            'slug': self.slug,
            'resumo': self.resumo,
            'corpo': self.corpo,
            'publicado': self.publicado,
            'thumbnail_url': self.thumbnail_url,
            'imagens_urls': self.imagens_urls.split('|') if self.imagens_urls else [],
            'data_publicacao': self.data_publicacao.strftime('%d/%m/%Y %H:%M') if self.data_publicacao else None
        }


class Newsletter(db.Model, QueryMixin):
    __tablename__ = 'newsletters'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(), nullable=False, unique=True)
    ultimo_envio = db.Column(db.DateTime)

    @classmethod
    def criar_de_json(cls, json_data):
        newsletter = cls()
        newsletter.email = json_data['email']
        newsletter.ultimo_envio = datetime.now()
        try:
            newsletter.save_db()
            return newsletter
        except IntegrityError:
            raise cls.JaExiste('Email já cadstrado')

    def as_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'ultimo_enviado': self.ultimo_envio.strftime('%d/%m/%Y')
        }


class EmailJaExisteNoNewsLetter(Exception):
    pass
