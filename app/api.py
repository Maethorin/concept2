# -*- coding: utf-8 -*-

from flask_restful import Api
import resources


def create_api(app):
    api = Api(app)
    api.add_resource(resources.Musicas, '/api/musicas', '/api/musicas/<int:musica_id>')
    api.add_resource(resources.ParserMusica, '/api/letra-musica')
    api.add_resource(resources.EditorMusica, '/api/editor-musica', '/api/editor-musica/<int:musica_id>')
