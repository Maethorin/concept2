'use strict';

angular.module(
    'concept2Admin',
    [
        'ngRoute',
        'ngResource',
        'concept2Admin.services',
        'concept2Admin.login',
        'concept2.home',
        'concept2Admin.inscricoes'
    ])
    .factory('atualizaToken', ['Autentic', '$rootScope', '$q', function(Autentic, $rootScope, $q) {
        return {
            response: function(response) {
                var headers = response.headers();
                if (headers['xsrf-token']) {
                   Autentic.atualizaValores(headers['xsrf-token'], headers['user-id'])
                }
                return response;
            },
            responseError: function(response) {
                if (response.status == 401) {
                    Autentic.limpaValores();
                    $rootScope.atletaLogado = Autentic.estaLogado();
                }
                return $q.reject(response);
            },
            request: function(config) {
                config.headers['XSRF-TOKEN'] = Autentic.token;
                return config;
            }
        };
    }])
    .config(['$sceDelegateProvider', '$httpProvider', function($sceDelegateProvider, $httpProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            '{0}/**'.format([urlBackEnd])
        ]);
        $httpProvider.defaults.withCredentials = true;
        $httpProvider.interceptors.push('atualizaToken');
    }])
    .run(['$rootScope', 'Autentic', function($rootScope, Autentic) {
        $rootScope.pagina = "";
        $rootScope.titulo = "";
        $rootScope.$on('$locationChangeSuccess', function(evt, absNewUrl, absOldUrl) {
            $rootScope.referrer = absOldUrl;
        });
        Autentic.atualizaValores();
        $rootScope.atletaLogado = Autentic.estaLogado();
    }]);
