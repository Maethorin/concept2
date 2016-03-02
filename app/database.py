# -*- coding: utf-8 -*-
from importlib import import_module
import os

from sqlalchemy_utils.types import choice


class AppRepository(object):
    db = None

config_module = os.environ['APP_SETTINGS'].split(".")
module = import_module('.'.join(config_module[:-1]))
config = getattr(module, config_module[-1])

DISTANCIAS = [
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

PROVAS = [
    ('I', 'Individual'),
    ('D', 'Dupla'),
    ('Q', 'Quadra'),
    ('8', '8'),
    ('R', 'Revezamento'),
    ('B', 'Biathlon'),
]

SEXO = [('MA', 'Masculino'), ('FE', 'Feminino'), ('MI', 'Misto')]

MODALIDADES = [
    ('clube-remo', 'Clube de Remo'),
    ('aula-coletiva', 'Aula Coletiva'),
    ('musculacao', 'Musculação'),
    ('crossfit', 'CrossFit')
]


class DistanciaTipo(choice.ChoiceType):
    def __init__(self):
        super(DistanciaTipo, self).__init__(DISTANCIAS)

    def __repr__(self):
        return "DistanciaTipo()"


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
