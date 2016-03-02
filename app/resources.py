# -*- coding: utf-8 -*-

from flask import request
from flask_restful import Resource

import models


class ResourceBase(Resource):
    model = None

    def obter_lista(self):
        return [item.to_dict() for item in self.model.query.all()]

    def obter_item(self, item_id):
        return self.model.query.get(item_id).to_dict()

    def get(self, item_id=None):
        if not item_id:
            return self.obter_lista()
        return self.obter_item(item_id)


class Produtos(ResourceBase):
    model = models.Produto


class OndeRemar(ResourceBase):
    model = models.OndeRemar

    def obter_lista(self):
        if 'modalidade' in request.args:
            return [item.to_dict() for item in self.model.apenas_modalidades(request.args.getlist('modalidade'))]
        return super(OndeRemar, self).obter_lista()

    def post(self):
        if 'csv' in request.args:
            self.model.adiciona_do_csv()
            return {'created': True}