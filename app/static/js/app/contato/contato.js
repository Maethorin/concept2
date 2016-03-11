'use strict';
angular.module('concept2.contato', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/contato', {
                templateUrl: '{0}/angular/contato.html'.format([urlBackEnd]),
                controller: 'ContatoController'
            })
    }])
    .controller('ContatoController', ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {
        $rootScope.pagina = "contato";
        $rootScope.titulo = "Contato"
    }]);
