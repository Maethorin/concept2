'use strict';

angular.module('concept2.home', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
          .when('/', {
            templateUrl: '/angular/home.html',
            controller: 'HomeController'
          })
    }])
    .controller("HomeController", function($rootScope, Autentic) {
        $rootScope.pagina = "home";
        $rootScope.titulo = "Inicial";
        $rootScope.atletaLogado = Autentic.token != 'undefined' && Autentic.token != null;
    });
