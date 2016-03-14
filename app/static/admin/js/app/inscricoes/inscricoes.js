'use strict';

angular.module('concept2Admin.inscricoes', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
          .when('/inscricoes', {
            templateUrl: '{0}/angular/crud/lista.html'.format([urlBackEnd]),
            controller: 'InscricoesController'
          })
    }])
    .controller("InscricoesController", ['$rootScope', function($rootScope) {
        $rootScope.pagina = "inscricoes";
        $rootScope.titulo = "Inscrições";
    }]);

