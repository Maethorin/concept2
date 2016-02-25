# -*- coding: utf-8 -*-
from sqlalchemy.orm import relationship
from database import AppRepository

db = AppRepository.db


class Cantor(db.Model):
    __tablename__ = 'cantores'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String())
    musicas = relationship("Musica", back_populates="cantor")

    @classmethod
    def cria_ou_obtem(cls, nome):
        cantor = cls.obter_pelo_nome(nome=nome)
        if not cantor:
            cantor = Cantor.cria_cantor(nome=nome)
        return cantor

    @classmethod
    def obter_pelo_nome(cls, nome):
        return cls.query.filter_by(nome=nome).first()

    @classmethod
    def cria_cantor(cls, nome):
        cantor = cls(nome=nome)
        db.session.add(cantor)
        return cantor


class Musica(db.Model):
    __tablename__ = 'musicas'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String())
    cantor_id = db.Column(db.Integer, db.ForeignKey('cantores.id'))
    cantor = relationship("Cantor", back_populates="musicas")
    sequencia = db.Column(db.String())
    cifra_url = db.Column(db.String())
    estrofes = relationship("Estrofe", back_populates="musica", cascade="save-update, merge, delete")

    @classmethod
    def cria_musica(cls, musica_dict):
        cantor = Cantor.cria_ou_obtem(nome=musica_dict['cantor'])
        musica = cls(
            nome=musica_dict['nome'],
            sequencia=musica_dict['sequencia'],
            cifra_url=musica_dict['cifraUrl'],
            cantor=cantor
        )
        db.session.add(musica)
        for estrofe_dict in musica_dict['estrofes']:
            musica.adiciona_estrofe(estrofe_dict)
        db.session.commit()
        return musica

    @classmethod
    def edita_musica(cls, musica_dict):
        musica = cls.query.get(musica_dict['id'])
        musica.cantor = None
        for estrofe in musica.estrofes:
            db.session.delete(estrofe)
        musica.estrofes = []
        db.session.commit()
        musica.nome = musica_dict['nome']
        musica.sequencia = musica_dict['sequencia']
        musica.cifra_url = musica_dict['cifraUrl']
        musica.cantor = Cantor.cria_ou_obtem(nome=musica_dict['cantor'])
        for estrofe_dict in musica_dict['estrofes']:
            musica.adiciona_estrofe(estrofe_dict)
        db.session.commit()
        return musica

    def adiciona_estrofe(self, estrofe_dict):
        estrofe = Estrofe(indice=estrofe_dict['indice'], musica=self)
        db.session.add(estrofe)
        for index, verso_dict in enumerate(estrofe_dict['versos']):
            estrofe.adiciona_verso(index, verso_dict)

    def to_dict(self, lista=False):
        as_dict = {'id': self.id, 'nome': self.nome, 'cantor': self.cantor.nome}
        if not lista:
            as_dict['letra'] = {}
            as_dict['sequencia'] = [int(numero) for numero in self.sequencia.split('-')]
            as_dict['cifraUrl'] = self.cifra_url
            for estrofe in self.estrofes:
                versos = []
                for verso in estrofe.versos:
                    if verso.cifra:
                        versos.append(verso.cifra)
                    if verso.letra:
                        versos.append(verso.letra)
                as_dict['letra'][estrofe.indice] = versos
        return as_dict

    def formato_editor(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'cantor': self.cantor.nome,
            'sequencia': self.sequencia,
            'cifraUrl': self.cifra_url,
            'estrofes': [estrofe.formato_editor() for estrofe in self.estrofes]
        }


class Estrofe(db.Model):
    __tablename__ = 'estrofes'
    id = db.Column(db.Integer, primary_key=True)
    indice = db.Column(db.Integer)
    musica_id = db.Column(db.Integer, db.ForeignKey('musicas.id'))
    musica = relationship("Musica", back_populates="estrofes")
    versos = relationship("Verso", back_populates="estrofe", cascade="save-update, merge, delete")

    def adiciona_verso(self, ordem, verso_dict):
        verso = Verso(ordem=ordem, letra=verso_dict['letra'], cifra=verso_dict['cifra'], estrofe=self)
        db.session.add(verso)

    def formato_editor(self):
        return {
            'indice': self.indice,
            'versos': [verso.formato_editor() for verso in self.versos]
        }


class Verso(db.Model):
    __tablename__ = 'versos'
    id = db.Column(db.Integer, primary_key=True)
    ordem = db.Column(db.Integer)
    estrofe_id = db.Column(db.Integer, db.ForeignKey('estrofes.id'))
    estrofe = relationship("Estrofe", back_populates="versos")
    cifra = db.Column(db.String())
    letra = db.Column(db.String())

    def formato_editor(self):
        return {
            'cifra': self.cifra,
            'letra': self.letra
        }
