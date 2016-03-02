# -*- coding: utf-8 -*-

from tests import base
from app import models


class TestOndeRemar(base.TestCase):
    def test_obtendo_modalidade_musculacao_como_padrao(self):
        row = {'TIPO': 'Não Existe'}
        codigo = models.OndeRemar.obter_codigo_modalidade(row)
        codigo.should.be.equal('musculacao')

    def test_obtendo_modalidade_musculacao(self):
        row = {'TIPO': 'Musculação'}
        codigo = models.OndeRemar.obter_codigo_modalidade(row)
        codigo.should.be.equal('musculacao')

    def test_obtendo_modalidade_clube_remo(self):
        row = {'TIPO': 'Clube de Remo'}
        codigo = models.OndeRemar.obter_codigo_modalidade(row)
        codigo.should.be.equal('clube-remo')

    def test_obtendo_modalidade_aula_coletiva(self):
        row = {'TIPO': 'Aula Coletiva'}
        codigo = models.OndeRemar.obter_codigo_modalidade(row)
        codigo.should.be.equal('aula-coletiva')

    def test_obtendo_modalidade_crossfit(self):
        row = {'TIPO': 'CrossFit'}
        codigo = models.OndeRemar.obter_codigo_modalidade(row)
        codigo.should.be.equal('crossfit')
        row = {'TIPO': 'Crossfit'}
        codigo = models.OndeRemar.obter_codigo_modalidade(row)
        codigo.should.be.equal('crossfit')
