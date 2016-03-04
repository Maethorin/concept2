# -*- coding: utf-8 -*-
import os

from flask import Flask, send_from_directory, g, jsonify
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.httpauth import HTTPBasicAuth

import database

auth = HTTPBasicAuth()
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
    # r.headers['Cache-Control'] = 'max-age=0'
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


@auth.verify_password
def verifica_senha(username_or_token, password):
    atleta = models.Atleta.verifica_token_aut(username_or_token)
    if not atleta:
        atleta = models.Atleta.obter_pelo_email(email=username_or_token)
        if not atleta or not atleta.verifica_senha(password):
            return False
    g.user = atleta
    return True


@web_app.route('/aut/token')
@auth.login_required
def obter_token_aut():
    token = g.user.gera_token_aut()
    return jsonify({'token': token.decode('ascii')})


def run():
    web_app.run(host='0.0.0.0', port=8080, debug=True)
