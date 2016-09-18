'use strict';
angular.module('concept2Admin.services', [])
    .service('Autentic', [function() {
        this.token = null;
        this.userId = null;
        this.atualizaValores = function(token, userId) {
            if (token) {
                localStorage.setItem('XSRFU-TOKEN', token);
            }
            if (userId) {
                localStorage.setItem('USERU-ID', userId);
            }
            this.token = localStorage.getItem('XSRFU-TOKEN');
            this.userId = localStorage.getItem('USERU-ID');
        };
        this.estaLogado = function() {
            return this.token != 'undefined' && this.token != null;
        };
        this.limpaValores = function() {
            localStorage.removeItem('XSRFU-TOKEN');
            localStorage.removeItem('USERU-ID');
            this.atualizaValores();
        };
    }])
    .service('Carregando', [function() {
        this.carregando = false;
        this.show = function() {
            if (!this.carregando) {
                this.carregando = true;
                waitingDialog.show('Carregando...');
            }
        };
        this.hide = function() {
            this.carregando = false;
            waitingDialog.hide();
        };
    }])
    .factory('OndeRemar', ['$resource', function($resource) {
        return $resource(
            '{0}/api/onde-remar/:id'.format([urlBackEnd]),
            null,
            {'update': {method: 'PUT'}}
        );
    }])
    .factory('Atleta', ['$resource', function($resource) {
        return $resource(
            '{0}/api/atletas/:id/:evento_slug'.format([urlBackEnd]),
            null,
            {'update': {method: 'PUT'}}
        );
    }])
    .factory('Login', ['$resource', function($resource) {
        return $resource(
            '{0}/api/login'.format([urlBackEnd]),
            null,
            {'update': {method: 'PUT'}}
        );
    }])
    .factory('Prova', ['$resource', function($resource) {
        return $resource(
            '{0}/api/provas/:id'.format([urlBackEnd]),
            null,
            {'update': {method: 'PUT'}}
        );
    }])
    .factory('Inscricao', ['$resource', function($resource) {
        return $resource(
            '{0}/api/inscricoes/:id'.format([urlBackEnd]),
            null,
            {'update': {method: 'PUT'}}
        );
    }])
    .factory('Evento', ['$resource', function($resource) {
        return $resource(
            '{0}/api/eventos/:id'.format([urlBackEnd]),
            null,
            {'update': {method: 'PUT'}}
        );
    }])
    .factory('Newsletter', ['$resource', function($resource) {
        return $resource('{0}/api/newsletters/:id'.format([urlBackEnd]));
    }])
    .factory('Noticia', ['$resource', function($resource) {
        return $resource(
            '{0}/api/noticias/:id'.format([urlBackEnd]),
            null,
            {'update': {method: 'PUT'}}
        );
    }])
    .factory('NoticiaImagem', ['$resource', function($resource) {
        return $resource('{0}/api/noticias/:id/imagens/:fileName'.format([urlBackEnd]));
    }]);
