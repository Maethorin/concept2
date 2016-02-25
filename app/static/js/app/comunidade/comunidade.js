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
        $rootScope.cssPagina = "pagina-comunidade";
        $rootScope.titulo = "Comunidade";
        $scope.comunidade = [];
        $http.get('/comunidade/comunidade.json').then(function (response) {
            $scope.comunidade = response.data;
        });
        //$http.jsonp('https://maps.googleapis.com/maps/api/js?key=AIzaSyAPtVcOptYSliotWo2NfjRYgUXc0RgNjgc&libraries=places&callback=initAutocomplete')
    }]);
