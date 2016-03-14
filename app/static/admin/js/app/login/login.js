'use strict';

angular.module('concept2Admin.login', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: '{0}/angular/login.html'.format([urlBackEnd]),
                controller: 'LoginController'
            })
            .when('/logout', {
                templateUrl: '{0}/angular/home.html'.format([urlBackEnd]),
                controller: 'LogoutController'
            });
    }])
    .controller("LogoutController", ['$window', 'Login', 'Autentic', function($window, Login, Autentic) {
        Autentic.limpaValores();
        var login = new Login();
        login.$delete().then(
            function () {
                Autentic.atualizaValores();
                $window.location = '/admin/';
            }
        );
    }])
    .controller("LoginController", ['$rootScope', '$scope', '$window', 'Login', 'Autentic', function($rootScope, $scope, $window, Login, Autentic) {
        $rootScope.pagina = "login";
        $rootScope.titulo = "Login";
        $scope.login = new Login({
            'email': null,
            'senha': null
        });
        $scope.campoValido = function(campo) {
            if (campo) {
                return campo.$touched && campo.$valid
            }
            return true;
        };
        $scope.campoInvalido = function(campo) {
            if (campo) {
                return campo.$touched && campo.$invalid
            }
            return false;
        };
        $scope.loginFalhou = false;
        $scope.enviandoLogin = function() {
            if ($scope.formLogin.$valid) {
                $scope.login.$save().then(
                    function (resp) {
                        Autentic.atualizaValores(resp.token, resp.userId);
                        $rootScope.adminLogado = Autentic.estaLogado();
                        if ($rootScope.referrer) {
                            $window.location = $rootScope.referrer;
                        }
                    },
                    function () {
                        $scope.loginFalhou = true;
                    }
                );
            }
        };
    }]);
