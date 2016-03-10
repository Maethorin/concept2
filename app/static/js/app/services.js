'use strict';
angular.module('concept2.services', [])
    .factory('Autentic', ['$cookies', function($cookies) {
        return {
            atualizaValores: function() {
                this.token = $cookies.get('XSRF-TOKEN');
                this.userId = $cookies.get('USER_ID');
            },
            limpaValores: function() {
                $cookies.remove('XSRF-TOKEN');
                $cookies.remove('USER_ID');
            },
            token: $cookies.get('XSRF-TOKEN'),
            userId: $cookies.get('USER_ID')
        }
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
    }]);
