# -*- coding: utf-8 -*-
import requests

from flask import request
from flask_restful import Resource
from lxml import html as lhtml

import models


class ParserMusica(Resource):
    def put(self):
        url = ''
        if 'url' in request.args:
            url = request.args['url']
        if 'url' in request.form:
            url = request.form['url']
        try:
            request_json = request.get_json()
            if 'url' in request_json:
                url = request_json['url']
        except:
            pass
        resposta = requests.get(url)
        parser = lhtml.HTMLParser(encoding='UTF-8')
        pagina = lhtml.fromstring(resposta.content, parser=parser)
        pre = pagina.cssselect('pre')
        nome = pagina.cssselect('.cifra .titulo')[0].text
        cantor = pagina.cssselect('.cifra .subtitulo a')[0].text
        return {
            "nome": nome.strip(),
            "cantor": cantor.strip(),
            "letra": lhtml.tostring(pre[0], encoding='UTF-8').replace('<pre>', '').replace('</pre>', '').split('\n')
        }


class EditorMusica(Resource):
    def get(self, musica_id):
        return models.Musica.query.get(musica_id).formato_editor()

    def post(self):
        try:
            musica_dict = request.get_jon()
            musica = models.Musica.cria_musica(musica_dict)
            return {'sucesso': True, "musica_id": musica.id}
        except Exception as ex:
            return {'sucesso': False, "mensagem": str(ex)}, 400

    def put(self):
        try:
            musica_dict = request.get_son()
            musica = models.Musica.edita_musica(musica_dict)
            return {'sucesso': True, 'musica': musica.formato_editor()}
        except Exception as ex:
            return {'sucesso': False, "mensagem": str(ex)}, 400


class Musicas(Resource):
    def _obter_musicas(self):
        return [musica.to_dict(lista=True) for musica in models.Musica.query.all()]

    def _obter_musica(self, musica_id):
        return models.Musica.query.get(musica_id).to_dict()

    def get(self, musica_id=None):
        if not musica_id:
            return self._obter_musicas()
        return self._obter_musica(musica_id)