'use strict';

angular.module('concept2Admin.login', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
          .when('/login', {
            templateUrl: '{0}/angular/login.html'.format([urlBackEnd]),
            controller: 'LoginController'
          })
    }])
    .controller("LoginController", ['$rootScope', function($rootScope) {
        $rootScope.pagina = "login";
        $rootScope.titulo = "Login";
    }]);

