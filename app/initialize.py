# -*- coding: utf-8 -*-
from datetime import datetime, timedelta
import json
import os

from flask import Flask, send_from_directory, g, request, Response
from flask.ext.sqlalchemy import SQLAlchemy

import database

web_app = Flask(__name__)
web_app.config.from_object(os.environ['APP_SETTINGS'])
database.AppRepository.db = SQLAlchemy(web_app)
app_directory = os.path.join(os.getcwd(), 'app')
template_directory = os.path.join(app_directory, 'templates')
template_admin_directory = os.path.join(template_directory, 'admin')

import api, models
api.create_api(web_app)

HEADERS = {
    'admin': {
        'token': 'XSRFU-TOKEN',
        'user': 'USERU-ID'
    },
    'atleta': {
        'token': 'XSRF-TOKEN',
        'user': 'USER-ID'
    }
}

DOMAIN = 'concept2.com.br'
if web_app.config['DEVELOPMENT']:
    DOMAIN = '127.0.0.1:8000'


@web_app.after_request
def add_header(r):
    r.headers['Cache-Control'] = "no-cache, no-store, must-revalidate"
    r.headers['Pragma'] = 'no-cache'
    r.headers['Expires'] = '0'
    r.headers['Access-Control-Allow-Origin'] = 'http://{}'.format(DOMAIN)
    r.headers['Access-Control-Allow-Credentials'] = 'true'
    r.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization,Set-Cookie,{},{},{},{}'.format(HEADERS['atleta']['token'], HEADERS['atleta']['user'], HEADERS['admin']['token'], HEADERS['admin']['user'])
    r.headers['Access-Control-Expose-Headers'] = 'Content-Type,Authorization,Set-Cookie,{},{},{},{}'
    r.headers['Access-Control-Allow-Methods'] = ','.join(['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'])
    r.headers['Access-Control-Max-Age'] = 21600
    return r


@web_app.route('/', methods=['GET', 'POST'])
def index():
    return send_from_directory(template_directory, 'index.html')


@web_app.route('/angular/<path:template_path>', methods=['GET', 'POST'])
def angular_template(template_path):
    return send_from_directory(template_directory, template_path)


@web_app.route('/admin/', methods=['GET', 'POST'])
def index_admin():
    return send_from_directory(template_admin_directory, 'index.html')


@web_app.route('/admin/angular/<path:template_path>', methods=['GET', 'POST'])
def angular_template_admin(template_path):
    if 'login' in template_path:
        return send_from_directory(template_admin_directory, template_path)
    user = g.get('user', None)
    if user is None:
        return Response('Não Autorizado', 401)
    if not user.eh_admin:
        return Response('Não Autorizado', 401)
    return send_from_directory(template_admin_directory, template_path)


@web_app.route('/json/<json_name>', methods=['GET', 'POST'])
def angular_json(json_name):
    return web_app.send_static_file("js/app/jsons/{}".format(json_name))


@web_app.route('/favicon.ico', methods=['GET'])
def favicon():
    return web_app.send_static_file("img/favicon.ico")


@web_app.route('/valida-lote', methods=['OPTIONS', 'POST'])
def valida_lote():
    if request.method == 'OPTIONS':
        return Response('OK')
    atletas_em_lote = request.files.get('atletasEmLote', None)
    if not atletas_em_lote:
        return Response(json.dumps({'mensagem': u'Nenhum arquivo foi recebido. Por favor, tente de novo'}), content_type='application/json', status=400)
    try:
        lista_atletas, lista_erros = models.Atleta.lista_de_atletas_de_csv(atletas_em_lote)
    except KeyError, ex:
        return Response(json.dumps({'mensagem': u'O arquivo está inválido pois falta a linha de cabeçalho'}), content_type='application/json', status=400)
    return Response(json.dumps({'atletasEmLote': lista_atletas, 'erros': lista_erros}), content_type='application/json')


@web_app.before_request
def before_request():
    token = request.headers.get(HEADERS['atleta']['token'], None)
    token_admin = request.headers.get(HEADERS['admin']['token'], None)
    usuario = None
    if token_admin:
        usuario = models.Admin.verifica_token_aut(token_admin)
    if token:
        usuario = models.Atleta.verifica_token_aut(token)
    if usuario:
        g.user = usuario


@web_app.after_request
def after_request(resp):
    user = g.get('user', None)
    if user is not None:
        token = user.gera_token_aut()
        header = HEADERS['admin'] if user.eh_admin else HEADERS['atleta']
        resp.headers[header['token']] = token.decode('ascii')
        resp.headers[header['user']] = str(user.id)
    return resp


def run():
    web_app.run(host='0.0.0.0', port=5000, debug=True)
