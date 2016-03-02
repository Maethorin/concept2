# -*- coding: utf-8 -*-

from flask_restful import Api
import resources


def create_api(app):
    api = Api(app)
    api.add_resource(resources.Produtos, '/api/produtos', '/api/produtos/<int:produto_id>')
    api.add_resource(resources.OndeRemar, '/api/onde-remar', '/api/onde-remar/<int:item_id>')
