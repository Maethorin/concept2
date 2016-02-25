'use strict';

angular.module('concept.home', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
          .when('/', {
            templateUrl: 'home/home.html',
            controller: 'HomeController'
          })
    }])
    .controller("HomeController", ['$rootScope', function($rootScope) {
        $rootScope.cssPagina = "pagina-home";
        $rootScope.titulo = "Inicial"
    }]);
