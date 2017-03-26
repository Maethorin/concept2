'use strict';

urlBackEnd = '{0}/admin'.format([urlBackEnd]);

angular.module(
    'concept2Admin',
    [
        'ngRoute',
        'ngResource',
        'ngFileUpload',
        'wysiwyg.module',
        'wu.masonry',
        'concept2Admin.services',
        'concept2Admin.login',
        'concept2Admin.home',
        'concept2Admin.eventos',
        'concept2Admin.newsletters',
        'concept2Admin.noticias'
    ])
    .factory('atualizaToken', ['Autentic', '$rootScope', '$q', '$window', function(Autentic, $rootScope, $q, $window) {
        return atualizaTokenFactory(Autentic, $rootScope, $q, $window, true);
    }])
    .config(['$sceDelegateProvider', '$httpProvider', '$locationProvider', function($sceDelegateProvider, $httpProvider, $locationProvider) {
        configApp($sceDelegateProvider, $httpProvider, $locationProvider);
    }])
    .run(['$rootScope', 'Autentic', function($rootScope, Autentic) {
        baseRun($rootScope, Autentic);
        $rootScope.adminLogado = Autentic.estaLogado();
        $rootScope.itensMenu = [
            {slug: 'eventos', label: 'eventos', url: '/admin/#/eventos', subItens: []},
            {slug: 'newsletters', label: 'newsletters', url: '/admin/#/newsletters', subItens: []},
            {slug: 'noticias', label: 'noticias', url: '/admin/#/noticias', subItens: []}
        ];
    }]);
