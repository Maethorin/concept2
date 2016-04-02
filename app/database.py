# -*- coding: utf-8 -*-
from importlib import import_module
import os

from sqlalchemy_utils.types import choice


class AppRepository(object):
    db = None

config_module = os.environ['APP_SETTINGS'].split(".")
module = import_module('.'.join(config_module[:-1]))
config = getattr(module, config_module[-1])

PROVAS = [
    ('I', 'Individual'),
    ('D', 'Dupla'),
    ('Q', 'Quadra'),
    ('8', 'Oito'),
    ('R', 'Revezamento'),
    ('B', 'Biathlon'),
]

SEXO = [('MA', 'Masc'), ('FE', 'Fem'), ('MI', 'Misto'), ('AB', 'Aberto')]

MODALIDADES = [
    ('clube-remo', 'Clube de Remo'),
    ('aula-coletiva', 'Aula Coletiva'),
    ('musculacao', 'Musculação'),
    ('crossfit', 'CrossFit')
]

TIPO_AFILIACAO = [
    ('clube', 'Clube'),
    ('academia', 'academina'),
    ('box-cf', 'Box de CF'),
    ('independente', 'Independente')
]

STATUS_PROVA = [
    ('NA', 'Não Aconteceu'),
    ('CA', 'Cancelada'),
    ('EA', 'Em Andamento'),
    ('EP', 'Em Apuração'),
    ('FN', 'Finalizada'),
    ('PP', 'Prova Prevista')
]


class ProvaTipo(choice.ChoiceType):
    def __init__(self):
        super(ProvaTipo, self).__init__(PROVAS)

    def __repr__(self):
        return "ProvaTipo()"


class SexoTipo(choice.ChoiceType):
    def __init__(self):
        super(SexoTipo, self).__init__(SEXO)

    def __repr__(self):
        return "SexoTipo()"


class StatusProva(choice.ChoiceType):
    def __init__(self):
        super(StatusProva, self).__init__(STATUS_PROVA)

    def __repr__(self):
        return "StatusProva()"


class ModalidadeTipo(choice.ChoiceType):
    def __init__(self):
        super(ModalidadeTipo, self).__init__(MODALIDADES)

    def __repr__(self):
        return "ModalidadeTipo()"


class AfiliacaoTipo(choice.ChoiceType):
    def __init__(self):
        super(AfiliacaoTipo, self).__init__(TIPO_AFILIACAO)

    def __repr__(self):
        return "AfiliacaoTipo()"
