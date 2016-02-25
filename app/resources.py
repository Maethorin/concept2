# -*- coding: utf-8 -*-

from flask import request
from flask_restful import Resource

import models


class Produtos(Resource):
    def _obter_produtos(self):
        return [produto.to_dict(lista=True) for produto in models.Produto.query.all()]

    def _obter_produto(self, produto_id):
        return models.Produto.query.get(produto_id).to_dict()

    def get(self, produto_id=None):
        if not produto_id:
            return self._obter_musicas()
        return self._obter_musica(produto_id)