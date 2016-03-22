'use strict';

urlBackEnd = 'http://concept2-staging.herokuapp.com';
if (window.location.hostname == '127.0.0.1') {
    urlBackEnd = 'http://localhost:5000';
}


angular.module('concept2', [
    'ngRoute',
    'ngResource',
    'ngCookies',
    'uiGmapgoogle-maps',
    'ui.mask',
    'ngFileUpload',
    'vcRecaptcha',
    'concept2.services',
    'concept2.login',
    'concept2.eventos'
])
    .factory('atualizaToken', ['Autentic', '$rootScope', '$q', function(Autentic, $rootScope, $q) {
        return atualizaTokenFactory(Autentic, $rootScope, $q);
    }])
    .config(function($sceDelegateProvider, $routeProvider, $httpProvider) {
        configApp($sceDelegateProvider, $httpProvider);
    })
    .run(function ($rootScope, Autentic) {
        baseRun($rootScope, Autentic);
        $rootScope.atletaLogado = Autentic.estaLogado();
    });
