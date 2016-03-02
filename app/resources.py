# -*- coding: utf-8 -*-

from flask import request
from flask_restful import Resource

import models


class ResourceBase(Resource):
    model = None

    def obter_lista(self, *args, **kwargs):
        return [item.to_dict() for item in self.model.obter_lista(*args, **kwargs)]

    def obter_item(self, item_id):
        return self.model.obter_item(item_id).to_dict()

    def get(self, item_id=None):
        if not item_id:
            return self.obter_lista()
        return self.obter_item(item_id)


class Produtos(ResourceBase):
    model = models.Produto


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