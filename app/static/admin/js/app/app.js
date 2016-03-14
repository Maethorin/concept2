'use strict';

urlBackEnd = '{0}/admin'.format([urlBackEnd]);

angular.module(
    'concept2Admin',
    [
        'ngRoute',
        'ngResource',
        'concept2Admin.services',
        'concept2Admin.login',
        'concept2Admin.home',
        'concept2Admin.inscricoes'
    ])
    .factory('atualizaToken', ['Autentic', '$rootScope', '$q', '$window', function(Autentic, $rootScope, $q, $window) {
        return atualizaTokenFactory(Autentic, $rootScope, $q, $window, true);
    }])
    .config(['$sceDelegateProvider', '$httpProvider', function($sceDelegateProvider, $httpProvider) {
        configApp($sceDelegateProvider, $httpProvider);
    }])
    .run(['$rootScope', 'Autentic', function($rootScope, Autentic) {
        $rootScope.pagina = "";
        $rootScope.titulo = "";
        $rootScope.$on('$locationChangeSuccess', function(evt, absNewUrl, absOldUrl) {
            $rootScope.referrer = absOldUrl;
        });
        Autentic.atualizaValores();
        $rootScope.adminLogado = Autentic.estaLogado();
    }]);
