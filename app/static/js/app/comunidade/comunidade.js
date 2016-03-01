'use strict';
angular.module('concept.comunidade',['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/comunidade', {
                templateUrl: '/angular/comunidade.html',
                controller: 'ComunidadeController'
            })
    }])
    .controller('ComunidadeController', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {
        $rootScope.pagina = "comunidade";
        $rootScope.titulo = "Comunidade";
        $scope.modalidades = [
            {'nome': 'Clube de Remo', 'slug': 'clube-remo', 'ativo': true},
            {'nome': 'CrossFit', 'slug': 'crossfit', 'ativo': true},
            {'nome': 'Musculação', 'slug': 'musculacao', 'ativo': true},
            {'nome': 'Aula Coletiva', 'slug': 'aula-coletiva', 'ativo': true}
        ];
        $scope.comunidade = [];
        //$http.jsonp('https://maps.googleapis.com/maps/api/js?key=AIzaSyAPtVcOptYSliotWo2NfjRYgUXc0RgNjgc&libraries=places&callback=initAutocomplete')
        $scope.alternaTipo = function(modalidade) {
            modalidade.ativo = !modalidade.ativo;
        }
    }]);
