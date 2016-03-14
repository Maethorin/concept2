# -*- coding: utf-8 -*-
from datetime import datetime, timedelta
import os

from flask import Flask, send_from_directory, g, request
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


DOMAIN = 'concept2.com.br'
if web_app.config['DEVELOPMENT']:
    DOMAIN = '127.0.0.1:8000'


@web_app.after_request
def add_header(r):
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    r.headers['Access-Control-Allow-Origin'] = 'http://{}'.format(DOMAIN)
    r.headers['Access-Control-Allow-Credentials'] = 'true'
    r.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization,Set-Cookie,XSRF-TOKEN,USER-ID'
    r.headers['Access-Control-Expose-Headers'] = 'Content-Type,Authorization,Set-Cookie,XSRF-TOKEN,USER-ID'
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
    return send_from_directory(template_admin_directory, template_path)


@web_app.route('/json/<json_name>', methods=['GET', 'POST'])
def angular_json(json_name):
    return web_app.send_static_file("js/app/jsons/{}".format(json_name))


@web_app.route('/favicon.ico', methods=['GET'])
def favicon():
    return web_app.send_static_file("img/favicon.ico")


@web_app.before_request
def before_request():
    token = request.headers.get('XSRF_TOKEN', None)
    eh_admin = request.headers.get('EH_ADMIN', 'false') == 'true'
    usuario = None
    if token:
        model = models.Admin if eh_admin else models.Atleta
        usuario = model.verifica_token_aut(token)
    if usuario:
        g.user = usuario


@web_app.after_request
def after_request(resp):
    user = g.get('user', None)
    if user is not None:
        token = user.gera_token_aut()
        resp.headers['XSRF-TOKEN'] = token.decode('ascii')
        resp.headers['USER-ID'] = str(user.id)
        resp.headers['EH-ADMIN'] = str(user.eh_admin).lower()
    return resp


def run():
    web_app.run(host='0.0.0.0', port=5000, debug=True)
