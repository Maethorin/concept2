'use strict';

angular.module('concept2Admin.eventos', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/eventos', {
                templateUrl: '{0}/angular/crud/eventos-lista.html'.format([urlBackEnd]),
                controller: 'EventosController'
            })
            .when('/eventos/:slug', {
                templateUrl: '{0}/angular/crud/eventos-elemento.html'.format([urlBackEnd]),
                controller: 'EventoController'
            });
    }])
    .controller("EventosController", ['$rootScope', '$scope', 'Evento', function($rootScope, $scope, Evento) {
        $rootScope.pagina = "eventos";
        $rootScope.titulo = "Eventos";
        $scope.lista = Evento.query();
    }])
    .controller("EventoController", ['$rootScope', '$routeParams', '$scope', '$route', 'Upload', 'Evento', 'Inscricao', 'Prova', function($rootScope, $routeParams, $scope, $route, Upload, Evento, Inscricao, Prova) {
        $scope.slug = $routeParams.slug;
        $rootScope.pagina = "evento";
        $rootScope.titulo = "Evento";
        $scope.evento = Evento.get({id: $scope.slug});
        $scope.statusProva = [
            {codigo: 'NA', nome: 'Não Aconteceu'},
            {codigo: 'CA', nome: 'Cancelada'},
            {codigo: 'EA', nome: 'Em Andamento'},
            {codigo: 'EP', nome: 'Em Apuração'},
            {codigo: 'FN', nome: 'Finalizada'},
            {codigo: 'PP', nome: 'Prova Prevista'}
        ];
        $scope.trocaStatusProva = function(prova, status) {
            Prova.update(
                {'id': prova.id},
                new Prova({'status': status.codigo}),
                function(response) {
                    prova.status = response.status;
                },
                function(response) {
                    alert('Erro')
                }
            );

        };
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
        $scope.enviaArquivoResultado = function(file, errFiles) {
            if (file) {
                file.upload = Upload.upload({
                    url: '{0}/resultado/{1}'.format([urlBackEnd, $scope.slug]),
                    data: {resultado: file}
                });
                file.upload.then(
                    function(response) {
                        alert('Enviado com sucesso');
                    },
                    function(response) {
                        alert('Erro');
                    }
                );
            }
        };
    }]);

