'use strict';

angular.module('concept2.login', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
          .when('/atleta/login', {
            templateUrl: '/angular/atleta/login.html',
            controller: 'LoginController'
          })
          .when('/atleta/logout', {
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
    .controller("LoginController", function($rootScope, $scope, Login, Autentic) {
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

                    },
                    function () {
                        $scope.loginFalhou = true;
                    }
                );
            }
        };
    });
