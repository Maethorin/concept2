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
    .controller('EventosController', ['$rootScope', '$scope', '$http', '$sce', function ($rootScope, $scope, $http, $sce) {
        $rootScope.pagina = "eventos";
        $rootScope.titulo = "Eventos";
        $scope.eventos = [];
        $scope.trataHtml = function(linha) {
            return $sce.trustAsHtml(linha);
        };
        $http.get('/json/eventos.json').then(function (response) {
            $scope.eventos = response.data;
        });
    }])
    .controller('EventoController', ['$rootScope', '$scope', '$routeParams', '$http', '$location', function ($rootScope, $scope, $routeParams, $http, $location) {
        $scope.slug = $routeParams.slug;
        $scope.itemMenu = $routeParams.itemMenu || 'categorias';
        $scope.template = '/angular/evento/{0}.html'.format([$scope.itemMenu]);
        $rootScope.pagina = "eventos";
        $scope.evento = {};
        $http.get('/json/' + $scope.slug + '.json').then(function(response) {
            $scope.evento = response.data;
            $rootScope.titulo = $scope.evento.titulo;
        });

         $scope.regulamentos =[];
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

    }]);
