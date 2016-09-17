'use strict';
angular.module('concept2.noticias', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/noticias', {
                templateUrl: '{0}/angular/noticias.html'.format([urlBackEnd]),
                controller: 'NoticiasController'
            })
    }])
    .controller('NoticiasController', ['$rootScope', '$scope', 'Noticia', function($rootScope, $scope, Noticia) {
        $rootScope.pagina = "noticias";
        $rootScope.titulo = "Noticias";
        $scope.noticias = Noticia.query();
    }]);
