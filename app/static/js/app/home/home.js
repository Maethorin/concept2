'use strict';

angular.module('concept2.home', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
          .when('/', {
            templateUrl: '{0}/angular/home.html'.format([urlBackEnd]),
            controller: 'HomeController'
          })
    }])
    .controller("HomeController", function($rootScope, Autentic) {
        $rootScope.pagina = "home";
        $rootScope.titulo = "Inicial";
        $rootScope.atletaLogado = Autentic.token != 'undefined' && Autentic.token != null;
    });
