'use strict';

angular.module('concept2.login', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
          .when('/atleta/login', {
            templateUrl: '{0}/angular/atleta/login.html'.format([urlBackEnd]),
            controller: 'LoginController'
          })
          .when('/atleta/logout', {
            templateUrl: '{0}/angular/home.html'.format([urlBackEnd]),
            controller: 'LogoutController'
          })
          .when('/atleta/perfil', {
            templateUrl: '{0}/angular/atleta/perfil.html'.format([urlBackEnd]),
            controller: 'PerfilController'
          })
          .when('/atleta/inscricoes', {
            templateUrl: '{0}/angular/atleta/inscricoes.html'.format([urlBackEnd]),
            controller: 'PerfilController'
          })
    }])
    .controller("LogoutController", ['$rootScope', '$scope', '$window', 'Login', 'Autentic', function($rootScope, $scope, $window, Login, Autentic) {
        Autentic.limpaValores();
        var login = new Login();
        login.$delete().then(
            function () {
                Autentic.atualizaValores();
                $rootScope.atletaLogado = false;
                if ($rootScope.referrer) {
                    $window.location = $rootScope.referrer;
                }
                else {
                    $window.location = '/';
                }
            }
        );
    }])
    .controller("LoginController", ['$rootScope', '$scope', '$window', 'Login', 'Autentic', function($rootScope, $scope, $window, Login, Autentic) {
        $rootScope.pagina = "atleta";
        $rootScope.titulo = "Atleta";
        $rootScope.atletaLogado = Autentic.token != 'undefined' && Autentic.token != null;
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
                    function () {
                        Autentic.atualizaValores();
                        $rootScope.atletaLogado = Autentic.estaLogado();
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
