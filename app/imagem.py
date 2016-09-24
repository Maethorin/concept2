# -*- coding: utf-8 -*-

import requests
from app import config as config_module

config = config_module.get_config()


class Uploader(object):
    upload_image_url = '{}/image'.format(config.THUMBOR_URL)
    headers = {'content-type': 'image/jpeg'}

    @classmethod
    def save(cls, file, name):
        cls.headers['slug'] = name
        result = requests.post(
            cls.upload_image_url,
            data=file,
            verify=False,
            headers=cls.headers
        )
        return result.headers['location']

    @classmethod
    def update(cls, file, name):
        cls.headers['slug'] = name
        result = requests.put(
            cls.upload_image_url,
            data=file,
            verify=False,
            headers=cls.headers
        )
        return result.headers['location']

    @classmethod
    def delete(cls, name):
        name = name.replace('/image/', '')
        return requests.delete('{}/{}'.format(
            cls.upload_image_url,
            name
        ))
