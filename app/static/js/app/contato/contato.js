'use strict';
angular.module('concept2.contato', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/contato', {
                templateUrl: '{0}/angular/contato.html'.format([urlBackEnd]),
                controller: 'ContatoController'
            })
    }])
     .config(['uiGmapGoogleMapApiProvider', function(uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyDzcLVVah4PjogAqerQdBcYowwzJcsKjv0',
            v: '3.20',
            language: 'pt-br',
            libraries: 'places'
        });
    }])
    .controller('ContatoController', ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {
        $rootScope.pagina = "contato";
        $rootScope.titulo = "Contato";
        $scope.mapa = { center: {latitude: -22.9747013, longitude: -43.3734641}, zoom: 17 };
        $scope.campoValido = function(campo) {
            return campo.$touched && !campo.$error.required
        };
        $scope.campoInvalido = function(campo) {
            return campo.$touched && campo.$error.required
        };
    }]);

