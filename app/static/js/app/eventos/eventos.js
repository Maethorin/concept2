'use strict';
angular.module('concept.eventos', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/eventos', {
                templateUrl: 'eventos/eventos.html',
                controller: 'EventosController'
            })
             .when('/eventos/:slug', {
                templateUrl: 'eventos/evento.html',
                controller:'EventoController'
            })
            .when('/eventos/:slug/inscricao', {
                templateUrl: 'eventos/formulariocabrari.html',
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

     .controller('EventoController', ['$rootScope', '$scope', '$routeParams', '$http', function ($rootScope, $scope, $routeParams, $http) {
        var slug = $routeParams.slug;
        $rootScope.cssPagina = "pagina-eventos";
        $rootScope.titulo = "Cabra-RI";
        $scope.evento = {};
        $http.get('eventos/' + slug + '.json').then(function (response){
            $scope.evento = response.data;
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
