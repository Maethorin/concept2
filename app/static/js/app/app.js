'use strict';

angular.module(
    'concept2',
    [
        'ngRoute',
        'ngResource',
        'ngCookies',
        'uiGmapgoogle-maps',
        'ui.mask',
        'vcRecaptcha',
        'concept2.services',
        'concept2.login',
        'concept2.home',
        'concept2.produtos',
        'concept2.noticias',
        'concept2.comunidade',
        'concept2.eventos',
        'concept2.suporte',
        'concept2.contato'
    ])
    .factory('atualizaToken', ['Autentic', '$rootScope', '$q', function(Autentic, $rootScope, $q) {
        return atualizaTokenFactory(Autentic, $rootScope, $q);
    }])
    .config(['$sceDelegateProvider', '$httpProvider', function($sceDelegateProvider, $httpProvider) {
        configApp($sceDelegateProvider, $httpProvider);
    }])
    .run(['$rootScope', 'Autentic', function($rootScope, Autentic) {
        baseRun($rootScope, Autentic);
        $rootScope.atletaLogado = Autentic.estaLogado();
    }]);
