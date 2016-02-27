'use strict';

angular.module('concept.home', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
          .when('/', {
            templateUrl: '/angular/home.html',
            controller: 'HomeController'
          })
    }])
    .controller("HomeController", ['$rootScope', function($rootScope) {
        $rootScope.pagina = "home";
        $rootScope.titulo = "Inicial"
    }]);
