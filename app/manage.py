# -*- coding: utf-8 -*-

import os

from flask.ext.script import Manager
from flask.ext.migrate import Migrate, MigrateCommand
import sys

from initialize import web_app

manager = Manager(web_app)


def register_migrate(manager):
    from models import db, Cantor, Musica, Estrofe, Verso
    migrate = Migrate(web_app, db)
    manager.add_command('db', MigrateCommand)
    return migrate

if __name__ == '__main__':
    if 'db' in sys.argv:
        migrate = register_migrate(manager)
    manager.run()
