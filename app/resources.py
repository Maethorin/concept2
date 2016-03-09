# -*- coding: utf-8 -*-

from flask import request, g
from flask_restful import Resource

import models


class ResourceBase(Resource):
    model = None

    def obter_lista(self, *args, **kwargs):
        return [item.as_dict() for item in self.model.obter_lista(*args, **kwargs)]

    def obter_item(self, item_id):
        return self.model.obter_item(item_id).as_dict()

    def get(self, item_id=None):
        if not item_id:
            return self.obter_lista()
        return self.obter_item(item_id)

    def options(self):
        return {'result': True}


class Produtos(ResourceBase):
    model = models.Produto


class Atletas(ResourceBase):
    model = models.Atleta

    def get(self, item_id=None, evento_slug=None):
        if evento_slug and item_id:
            return self.model.obter_atleta_com_inscricao_para_o_evento(item_id, evento_slug).as_dict()
        return super(Atletas, self).get(item_id)

    def post(self):
        try:
            g.user = self.model.cria_de_dicionario(request.json)
        except KeyError as ex:
            return {'mensagemErro': u'Dados faltando: {}'.format(ex)}, 400
        except models.EmailJaExiste as ex:
            return {'mensagemErro': u'{}'.format(ex)}, 400
        except Exception:
            return {'mensagemErro': u'Ocorreu um erro e não pudemos gravar a inscrição. Por favor, tente mais tarde.'}, 500

    def put(self, item_id):
        try:
            self.model.atualiza_de_dicionario(item_id, request.json)
        except KeyError as ex:
            return {'Dados faltando: {}'.format(ex)}, 400
        except Exception:
            return {'mensagemErro': u'Ocorreu um erro e não pudemos gravar a inscrição. Por favor, tente mais tarde.'}, 500


class Inscricoes(Resource):
    model = models.Inscricao

    def get(self, atleta_id, inscricao_id=None):
        return self.model.obter_atleta(atleta_id).obter_inscricao(inscricao_id).as_dict()

    def put(self, atleta_id, inscricao_id):
        return models.Atleta.obter_atleta(atleta_id).atualiza_inscricao_de_dicionario(inscricao_id, request.json)

    def options(self):
        return {'result': True}


class Eventos(ResourceBase):
    model = models.Evento


class OndeRemar(ResourceBase):
    model = models.OndeRemar

    def obter_lista(self):
        kwargs = {}
        if 'modalidade' in request.args:
            kwargs = {'modalidade': request.args.getlist('modalidade')}
        return super(OndeRemar, self).obter_lista(**kwargs)

    def post(self):
        if 'csv' in request.args:
            self.model.adiciona_do_csv()
            return {'created': True}


class Login(Resource):
    def delete(self):
        g.user = None

    def post(self):
        try:
            g.user = models.Atleta.obter_pelo_email(request.json['email'])
            if g.user.verifica_senha(request.json['senha']):
                return {'resultado': 'Login Aceito'}
        except Exception:
            pass
        return {'resultado': 'Login Recusado'}, 401

    def options(self):
        return {'result': True}
