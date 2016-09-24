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
    .constant('appConfig', {
        thumborURL: 'https://concept2-thumbor.herokuapp.com'
    })
    .factory('atualizaToken', ['Autentic', '$rootScope', '$q', '$window', function(Autentic, $rootScope, $q, $window) {
        return atualizaTokenFactory(Autentic, $rootScope, $q, $window, true);
    }])
    .config(['$sceDelegateProvider', '$httpProvider', function($sceDelegateProvider, $httpProvider) {
        configApp($sceDelegateProvider, $httpProvider);
    }])
    .run(['$rootScope', 'Autentic', 'appConfig', function($rootScope, Autentic, appConfig) {
        baseRun($rootScope, Autentic, appConfig);
        $rootScope.adminLogado = Autentic.estaLogado();
        $rootScope.itensMenu = [
            {slug: 'eventos', label: 'eventos', url: '/admin/#/eventos', subItens: []},
            {slug: 'newsletters', label: 'newsletters', url: '/admin/#/newsletters', subItens: []},
            {slug: 'noticias', label: 'noticias', url: '/admin/#/noticias', subItens: []}
        ];
    }]);
