'use strict';

urlBackEnd = '{0}/admin'.format(urlBackEnd);

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
    .factory('atualizaToken', ['Autentic', '$rootScope', '$q', function(Autentic, $rootScope, $q) {
        return atualizaTokenFactory(Autentic, $rootScope, $q);
    }])
    .config(['$sceDelegateProvider', '$httpProvider', function($sceDelegateProvider, $httpProvider) {
        configApp($sceDelegateProvider, $httpProvider);
    }])
    .run(['$rootScope', 'Autentic', function($rootScope, Autentic) {
        baseRun($rootScope, Autentic);
        $rootScope.adminLogado = Autentic.estaLogado(true);
    }]);
