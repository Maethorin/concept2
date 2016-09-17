# -*- coding: utf-8 -*-

from flask_restful import Api
import resources


def create_api(app):
    api = Api(app)
    api.add_resource(resources.OndeRemar, '/api/onde-remar', '/api/onde-remar/<int:item_id>')
    api.add_resource(resources.Produtos, '/api/produtos', '/api/produtos/<int:item_id>')
    api.add_resource(resources.Eventos, '/api/eventos', '/api/eventos/<string:item_id>')
    api.add_resource(resources.Resultados, '/api/eventos/<string:item_id>/resultados')
    api.add_resource(resources.Newsletter, '/api/newsletters')
    api.add_resource(resources.Noticia, '/api/noticias', '/api/noticias/<string:item_id>')

    api.add_resource(resources.LoginAtleta, '/api/login')
    api.add_resource(resources.Atletas, '/api/atletas', '/api/atletas/<int:item_id>', '/api/atletas/<int:item_id>/<string:evento_slug>')
    api.add_resource(resources.InscricoesAtletas, '/api/atletas/<int:atleta_id>/inscricoes', '/api/atletas/<int:atleta_id>/inscricoes/<int:inscricao_id>')

    api.add_resource(resources.LoginAdmin, '/admin/api/login')
    api.add_resource(resources.EventosAdmin, '/admin/api/eventos', '/admin/api/eventos/<string:item_id>')
    api.add_resource(resources.ProvasAdmin, '/admin/api/provas', '/admin/api/provas/<int:item_id>')
    api.add_resource(resources.InscricoesAdmin, '/admin/api/inscricoes', '/admin/api/inscricoes/<int:item_id>')
    api.add_resource(resources.NewsletterAdmin, '/admin/api/newsletters', '/admin/api/newsletters/<int:item_id>')
    api.add_resource(resources.NoticiaAdmin, '/admin/api/noticias', '/admin/api/noticias/<int:item_id>')
    api.add_resource(resources.NoticiaImagemAdmin, '/admin/api/noticias/imagem')
