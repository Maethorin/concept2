'use strict';

angular.module('concept2.login', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
          .when('/atleta/login', {
            templateUrl: '/angular/atleta/login.html',
            controller: 'LoginController'
          })
          .when('/atleta/logout', {
            templateUrl: '/angular/home.html',
            controller: 'LogoutController'
          })
          .when('/atleta/perfil', {
            templateUrl: '/angular/atleta/perfil.html',
            controller: 'PerfilController'
          })
          .when('/atleta/inscricoes', {
            templateUrl: '/angular/atleta/inscricoes.html',
            controller: 'PerfilController'
          })
    }])
    .controller("LogoutController", function($rootScope, $scope, $window, Login, Autentic) {
        var login = new Login();
        login.$delete().then(
            function () {
                Autentic.limpaValores();
                Autentic.atualizaValores();
                $rootScope.atletaLogado = Autentic.token != 'undefined' && Autentic.token != null;
                if ($rootScope.referrer) {
                    $window.location = $rootScope.referrer;
                }
                else {
                    $window.location = '/';
                }
            }
        );
    })
    .controller("LoginController", function($rootScope, $scope, $window, Login, Autentic) {
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
                        $rootScope.atletaLogado = Autentic.token != 'undefined' && Autentic.token != null;
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
    });
