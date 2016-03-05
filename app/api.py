# -*- coding: utf-8 -*-

from flask_restful import Api
import resources


def create_api(app):
    api = Api(app)
    api.add_resource(resources.Produtos, '/api/produtos', '/api/produtos/<int:item_id>')
    api.add_resource(resources.Atletas, '/api/atletas', '/api/atletas/<int:item_id>', '/api/atletas/<int:item_id>/<string:evento_slug>')
    api.add_resource(resources.Inscricoes, '/api/atletas/<int:atleta_id>/inscricoes', '/api/atletas/<int:atleta_id>/inscricoes/<int:inscricao_id>')
    api.add_resource(resources.Eventos, '/api/eventos', '/api/eventos/<string:item_id>')
    api.add_resource(resources.OndeRemar, '/api/onde-remar', '/api/onde-remar/<int:item_id>')
