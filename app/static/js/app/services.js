'use strict';
angular.module('concept2.services', [])
    .service('Autentic', [function() {
        this.token = null;
        this.userId = null;
        this.atualizaValores = function(token, userId) {
            if (token) {
                localStorage.setItem('XSRF-TOKEN', token);
            }
            if (userId) {
                localStorage.setItem('USER-ID', userId);
            }
            this.token = localStorage.getItem('XSRF-TOKEN');
            this.userId = localStorage.getItem('USER-ID');
        };
        this.estaLogado = function() {
            return this.token != 'undefined' && this.token != null;
        };
        this.limpaValores = function() {
            localStorage.removeItem('XSRF-TOKEN');
            localStorage.removeItem('USER-ID');
            this.atualizaValores();
        };
    }])
    .factory('OndeRemar', ['$resource', function($resource) {
        return $resource('{0}/api/onde-remar/:id'.format([urlBackEnd]));
    }])
    .factory('Atleta', ['$resource', function($resource) {
        return $resource('{0}/api/atletas/:id/:evento_slug'.format([urlBackEnd]));
    }])
    .factory('Login', ['$resource', function($resource) {
        return $resource('{0}/api/login'.format([urlBackEnd]));
    }])
    .factory('Inscricao', ['$resource', function($resource) {
        return $resource(
            '{0}/api/atletas/:id/inscricoes/:inscricao_id'.format([urlBackEnd]),
            null,
            {'update': {method: 'PUT'}}
        );
    }])
    .factory('Evento', ['$resource', function($resource) {
        return $resource('{0}/api/eventos/:id'.format([urlBackEnd]));
    }])
    .factory('Resultado', ['$resource', function($resource) {
        return $resource('{0}/api/eventos/:id/resultados'.format([urlBackEnd]));
    }])
    .factory('Newsletter', ['$resource', function($resource) {
        return $resource('{0}/api/newsletter'.format([urlBackEnd]));
    }]);
