'use strict';
angular.module('concept2.eventos', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/eventos', {
                templateUrl: '/angular/eventos.html',
                controller: 'EventosController'
            })
             .when('/eventos/:slug', {
                templateUrl: '/angular/evento/evento.html',
                controller:'EventoController'
            })
            .when('/eventos/:slug/:itemMenu', {
                templateUrl: '/angular/evento/evento.html',
                controller:'EventoController'
            })
    }])
    .controller('EventosController', function ($rootScope, $scope, $http, $sce, Evento) {
        $rootScope.pagina = "eventos";
        $rootScope.titulo = "Eventos";
        $scope.eventos = [];
        $scope.trataHtml = function(linha) {
            return $sce.trustAsHtml(linha);
        };
        $scope.eventos = Evento.query();
    })
    .controller('EventoController', function ($rootScope, $scope, $routeParams, $http, $sce, Evento) {
        $scope.slug = $routeParams.slug;
        $scope.itemMenu = $routeParams.itemMenu || 'sobre';
        $scope.template = '/angular/evento/{0}.html'.format([$scope.itemMenu]);
        $rootScope.pagina = "eventos";
        $scope.itensMenu = [
            {"slug": "sobre", "nome": "Sobre"},
            {"slug": "categorias", "nome": "Categorias"},
            {"slug": "horarios", "nome": "Horários"},
            {"slug": "regulamento", "nome": "Regulamento"},
            {"slug": "resultados", "nome": "Resultados"},
            {"slug": "inscricao", "nome": "Inscreva-se"}
        ];
        $scope.evento = Evento.get({"id": $scope.slug}, function() {
            $rootScope.titulo = $scope.evento.titulo;
        });
        $scope.regulamentos =[];
        $scope.trataHtml = function(html) {
            return $sce.trustAsHtml(html);
        };
        $http.get('/static/js/app/jsons/regulamento.json').then(function(response) {
            $scope.regulamentos = response.data;
        });
        $scope.dadosInscricao = {
            "nome": null,
            "sobrenome": null,
            "afiliacao": null,
            "cpf": null,
            "telefone": null,
            "time": null,
            "data": null,
            "email": null
            //adicionar os outros campos
        };
        $scope.maskDef = {'maskDefinitions': {'9': /\d/, 'D': /[0-3]/, 'd': /[0-9]/, 'M': /[0-1]/, 'm': /[0-2]/}};
        $scope.campoEstaValido = function (campo) {
            return campo.$touched && !campo.$error.required

        };
        $scope.campoEstaInvalido = function (campo) {
            return campo.$touched && campo.$error.required

        };
        $scope.campoNaoTocado = function (campo) {
            return !campo.$touched

        };
    });
