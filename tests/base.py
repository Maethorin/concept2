# -*- coding: utf-8 -*-

import os
import unittest
from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from mock import mock

from app import database

test_app = Flask(__name__)
test_app.config.from_object(os.environ['APP_SETTINGS'])
database.AppRepository.db = SQLAlchemy(test_app)


class TestCase(unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super(TestCase, self).__init__(*args, **kwargs)
        self.mock = mock
