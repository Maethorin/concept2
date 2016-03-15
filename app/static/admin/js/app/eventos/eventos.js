'use strict';

angular.module('concept2Admin.eventos', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
          .when('/eventos', {
            templateUrl: '{0}/angular/crud/lista.html'.format([urlBackEnd]),
            controller: 'EventosController'
          })
          .when('/eventos/:slug', {
            templateUrl: '{0}/angular/crud/elemento.html'.format([urlBackEnd]),
            controller: 'EventoController'
          })
    }])
    .controller("EventosController", ['$rootScope', '$scope', 'Evento', function($rootScope, $scope, Evento) {
        $rootScope.pagina = "eventos";
        $rootScope.titulo = "Eventos";
        $scope.lista = Evento.query();
    }])
    .controller("EventoController", ['$rootScope', '$routeParams', '$scope', 'Evento', function($rootScope, $routeParams, $scope, Evento) {
        $scope.slug = $routeParams.slug;
        $rootScope.pagina = "evento";
        $rootScope.titulo = "Evento";
        $scope.evento = Evento.get({id: $scope.slug});
        $scope.formataTelefone = function(numero) {
            numero = numero.split('');
            var ddd = numero.splice(0, 2).join('');
            var parte1 = numero.splice(0, 4).join('');
            var parte2 = numero.join('');
            return '({0}) {1}-{2}'.format([ddd, parte1, parte2]);
        };
        $scope.formataData = function(data) {
            return '{dia}/{mes}/{ano}'.format(quebraData(data, true));
        };
        $scope.calculaIdade = function(nascimento) {
            return calculaIdadeAtleta(nascimento);
        }
    }]);

