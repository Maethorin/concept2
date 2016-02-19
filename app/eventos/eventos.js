'use strict';
angular.module('concept.eventos', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/eventos', {
                templateUrl: 'eventos/eventos.html',
                controller: 'EventosController'
            })
            .when('/eventos/cabra', {
                templateUrl: 'eventos/cabra-ri.html',
                controller: 'CampoController'
            })
    }])
    .controller('EventosController', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {
        $rootScope.cssPagina = "pagina-eventos";
        $rootScope.titulo = "Eventos";
        $scope.eventos = [];
        $http.get('/eventos/eventos.json').then(function (response) {
            $scope.eventos = response.data;
        });
    }])
    .controller('CampoController', ['$rootScope', '$scope', function ($rootScope, $scope) {
        $rootScope.cssPagina = "pagina-eventos";
        $rootScope.titulo = "Eventos";
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
