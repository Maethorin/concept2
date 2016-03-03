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


class ModalidadeTipo(choice.ChoiceType):
    def __init__(self):
        super(ModalidadeTipo, self).__init__(MODALIDADES)

    def __repr__(self):
        return "ModalidadeTipo()"
