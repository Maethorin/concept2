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
static_directory = os.path.join(app_directory, 'static')

import api, models
api.create_api(web_app)


@web_app.after_request
def add_header(r):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    r.headers['Access-Control-Allow-Origin'] = 'http://concept2.com.br' #'http://localhost:8000'
    r.headers['Access-Control-Allow-Credentials'] = 'true'
    r.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization,Set-Cookie'
    r.headers['Access-Control-Allow-Methods'] = ','.join(['GET', 'PUT', 'POST', 'DELETE'])
    r.headers['Access-Control-Max-Age'] = 21600
    return r


@web_app.route('/', methods=['GET', 'POST'])
def index():
    return send_from_directory(template_directory, 'index.html')


@web_app.route('/angular/<path:template_path>', methods=['GET', 'POST'])
def angular_template(template_path):
    return send_from_directory(template_directory, template_path)


@web_app.route('/json/<json_name>', methods=['GET', 'POST'])
def angular_json(json_name):
    return web_app.send_static_file("js/app/jsons/{}".format(json_name))


@web_app.route('/favicon.ico', methods=['GET'])
def favicon():
    return web_app.send_static_file("img/favicon.ico")


@web_app.before_request
def before_request():
    token = request.cookies.get('XSRF-TOKEN', None)
    atleta = None
    if token:
        atleta = models.Atleta.verifica_token_aut(token)
    if atleta:
        g.user = atleta


@web_app.after_request
def after_request(resp):
    user = g.get('user', None)
    if user is not None:
        token = user.gera_token_aut()
        expiration = datetime.utcnow() + timedelta(seconds=600)
        resp.set_cookie('XSRF-TOKEN', token.decode('ascii'), expires=expiration)
        resp.set_cookie('USER_ID', str(user.id), expires=expiration)
    else:
        resp.set_cookie('XSRF-TOKEN', '', expires=0)
        resp.set_cookie('USER_ID', '', expires=0)
    return resp


def run():
    web_app.run(host='0.0.0.0', port=5000, debug=True)
