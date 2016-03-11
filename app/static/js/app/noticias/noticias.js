'use strict';
angular.module('concept2.noticias', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/noticias', {
                templateUrl: '{0}/angular/noticias.html'.format([urlBackEnd]),
                controller: 'NoticiasController'
            })
    }])
    .controller('NoticiasController', ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {
        $rootScope.pagina = "noticias";
        $rootScope.titulo = "Noticias";
        $scope.noticias = [];
        $http.get('/json/noticias.json').then(function(response) {
            $scope.noticias = response.data;
        });
    }]);
