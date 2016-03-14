'use strict';

angular.module('concept2Admin.home', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
          .when('/', {
            templateUrl: '{0}/angular/home.html'.format([urlBackEnd]),
            controller: 'HomeController'
          })
    }])
    .controller("HomeController", ['$rootScope', 'Autentic', function($rootScope, Autentic) {
        $rootScope.pagina = "home";
        $rootScope.titulo = "Inicial";
    }]);

