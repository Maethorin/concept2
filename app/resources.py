# -*- coding: utf-8 -*-

from flask import request, g
from flask_restful import Resource

import models


def usuario_esta_logado(eh_admin=False):
    user = getattr(g, 'user', None)
    if user is None:
        return False
    if eh_admin:
        return user.eh_admin
    return True


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

    def options(self, *args, **kwargs):
        return {'result': True}


class ResourceAdmin(ResourceBase):
    def get(self, item_id=None):
        if not usuario_esta_logado(eh_admin=True):
            return {'result': 'Não autorizado'}, 401
        return super(ResourceAdmin, self).get(item_id)


class EventosAdmin(ResourceAdmin):
    model = models.Evento


class InscricoesAdmin(ResourceAdmin):
    model = models.Inscricao

    def put(self, item_id):
        if 'estahPago' in request.json:
            return self.model.define_pagamento(item_id, request.json['estahPago']).as_dict()


class Produtos(ResourceBase):
    model = models.Produto


class Atletas(ResourceBase):
    model = models.Atleta

    def get(self, item_id=None, evento_slug=None):
        if not usuario_esta_logado():
            return {'result': 'Não autorizado'}, 401
        if not item_id and not usuario_esta_logado(eh_admin=True):
            return {'result': 'Não autorizado'}, 401
        if evento_slug and item_id:
            return self.model.obter_atleta_com_inscricao_para_o_evento(item_id, evento_slug).as_dict()
        return super(Atletas, self).get(item_id)

    def post(self):
        try:
            g.user = self.model.cria_de_dicionario(request.json)
            return {'token': g.user.gera_token_aut(), 'userId': g.user.id}
        except KeyError as ex:
            return {'mensagemErro': u'Dados faltando: {}'.format(ex)}, 400
        except models.EmailJaExiste as ex:
            return {'mensagemErro': u'{}'.format(ex)}, 400
        except Exception:
            return {'mensagemErro': u'Ocorreu um erro e não pudemos gravar a inscrição. Por favor, tente mais tarde.'}, 500

    def put(self, item_id):
        if not usuario_esta_logado():
            return {'result': 'Não autorizado'}, 401
        if not item_id:
            return {'result': 'Dados Inválidos'}, 400
        try:
            if int(item_id) != g.user.id:
                return {'result': 'Não autorizado'}, 401
            self.model.atualiza_de_dicionario(item_id, request.json)
        except KeyError as ex:
            return {'Dados faltando: {}'.format(ex)}, 400
        except Exception:
            return {'mensagemErro': u'Ocorreu um erro e não pudemos gravar a inscrição. Por favor, tente mais tarde.'}, 500


class InscricoesAtletas(Resource):
    model = models.Inscricao

    def get(self, atleta_id, inscricao_id=None):
        if not usuario_esta_logado():
            return {'result': 'Não autorizado'}, 401
        return self.model.obter_atleta(atleta_id).obter_inscricao(inscricao_id).as_dict()

    def put(self, atleta_id, inscricao_id):
        if not usuario_esta_logado():
            return {'result': 'Não autorizado'}, 401
        if not atleta_id or not inscricao_id:
            return {'result': 'Dados Inválidos'}, 400
        if int(atleta_id) != g.user.id:
            return {'result': 'Não autorizado'}, 401
        return models.Atleta.obter_atleta(atleta_id).atualiza_inscricao_de_dicionario(inscricao_id, request.json)

    def options(self, *args, **kwargs):
        return {'result': True}


class Resultados(ResourceBase):
    model = models.Resultado

    def get(self, item_id=None):
        return self.model.obter_lista(evento_slug=item_id)


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
        if not usuario_esta_logado(eh_admin=True):
            return {'result': 'Não autorizado'}, 401
        if 'csv' in request.args:
            self.model.adiciona_do_csv()
            return {'created': True}


class LoginResource(Resource):
    model = None

    def delete(self):
        g.user = None

    def post(self):
        try:
            g.user = self.model.obter_pelo_email(request.json['email'])
            if g.user.verifica_senha(request.json['senha']):
                return {'token': g.user.gera_token_aut(), 'userId': g.user.id}
        except Exception:
            pass
        return {'resultado': 'Login Recusado'}, 401

    def options(self, *args, **kwargs):
        return {'result': True}


class LoginAtleta(LoginResource):
    model = models.Atleta


class LoginAdmin(LoginResource):
    model = models.Admin
