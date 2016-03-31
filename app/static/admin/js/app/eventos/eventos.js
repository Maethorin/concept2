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
    .controller("EventoController", ['$rootScope', '$routeParams', '$scope', '$route', 'Evento', 'Inscricao', function($rootScope, $routeParams, $scope, $route, Evento, Inscricao) {
        $scope.slug = $routeParams.slug;
        $rootScope.pagina = "evento";
        $rootScope.titulo = "Evento";
        $scope.evento = Evento.get({id: $scope.slug});
        $scope.marcarPago = function(inscricaoId) {
            var inscricao = new Inscricao({estahPago: true});
            Inscricao.update(
                {'id': inscricaoId},
                inscricao,
                function() {
                    $route.reload();
                },
                function(response) {
                    console.log(response);
                    alert(response);
                }
            );
        };
    }]);

