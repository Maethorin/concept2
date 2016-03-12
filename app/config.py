#  -*- coding: utf-8 -*-
import os


class Config(object):
    DEBUG = False
    TESTING = False
    DEVELOPMENT = False
    CSRF_ENABLED = True
    SECRET_KEY = os.environ['SECRET_KEY']
    SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL']
    GOOGLE_API_KEY = 'AIzaSyDzcLVVah4PjogAqerQdBcYowwzJcsKjv0'


class ProductionConfig(Config):
    DEBUG = False


class StagingConfig(Config):
    DEBUG = True


class DevelopmentConfig(Config):
    DEVELOPMENT = True
    DEBUG = True


class TestingConfig(Config):
    TESTING = True