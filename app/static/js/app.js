'use strict';

angular.module('concept', [
    'ngRoute',
    'concept.home',
    'concept.produtos',
    'concept.noticias',
    'concept.comunidade',
    'concept.eventos',
    'concept.suporte',
    'concept.contato'
]);

app.run(['$rootscope', '$window', 'srvAuth',
    function ($rootscope, $window, sAuth) {
        $rootscope.user = {};
        $window.fbAsyncInit = function () {
            FB.init({
                appId: '1745932382309577',
                status: true,
                cookie: true,
                xfbml: true,
                version: 'v2.5'
            });
            sAuth.watchAuthenticationStatusChange();
        };
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/pt_BR/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }
])