'use strict';

angular.module(
    'concept2',
    [
        'ngRoute',
        'ngResource',
        'ngCookies',
        'uiGmapgoogle-maps',
        'ui.mask',
        'ngFileUpload',
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
    .constant('appConfig', {
        thumborURL: 'https://concept2-thumbor.herokuapp.com'
    })
    .factory('atualizaToken', ['Autentic', '$rootScope', '$q', function(Autentic, $rootScope, $q) {
        return atualizaTokenFactory(Autentic, $rootScope, $q);
    }])
    .config(['$sceDelegateProvider', '$httpProvider', function($sceDelegateProvider, $httpProvider) {
        configApp($sceDelegateProvider, $httpProvider);
    }])
    .run(['$rootScope', '$timeout', 'Autentic', 'Newsletter', 'appConfig', function($rootScope, $timeout, Autentic, Newsletter, appConfig) {
        baseRun($rootScope, Autentic, appConfig);
        $rootScope.atletaLogado = Autentic.estaLogado();
        $rootScope.labelNewsletter = 'ASSINAR';
        $rootScope.emailNewsletter = null;
        $rootScope.emailJaExisteNaNewsletter = false;
        $rootScope.enviarNewsletter = function(form) {
            if ($rootScope.labelNewsletter == 'ENVIANDO') {
                return false;
            }
            $rootScope.emailJaExisteNaNewsletter = false;
            if (form.$invalid) {
                alert('Digite um email válido');
                return false;
            }
            if (!$rootScope.emailNewsletter) {
                alert('Digite um email válido');
                return false;
            }
            $rootScope.labelNewsletter = 'ENVIANDO';
            Newsletter.save(
                {email: $rootScope.emailNewsletter},
                function() {
                    $rootScope.labelNewsletter = 'PRONTO';
                    $timeout(function() {
                        $rootScope.labelNewsletter = 'ASSINAR';
                    }, 1500);
                },
                function(response) {
                    $rootScope.labelNewsletter = 'ASSINAR';
                    if (response.status == 400 && response.data.erro == 'ja-existe') {
                        $rootScope.emailJaExisteNaNewsletter = true;
                    }
                    else {
                        alert('Ocorreu um erro no registro da newsletter. Por favor, tente de novo');
                    }
                }
            )
        };
    }]);
