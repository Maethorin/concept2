'use strict';
angular.module('concept2.comunidade', [])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/comunidade', {
                templateUrl: '/angular/comunidade.html',
                controller: 'ComunidadeController'
            })
    }])
    .config(function(uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyDzcLVVah4PjogAqerQdBcYowwzJcsKjv0',
            v: '3.20',
            language: 'pt-br',
            libraries: 'places'
        });
    })
    .controller('ComunidadeController', function ($rootScope, $scope, $http, OndeRemar) {
        $rootScope.pagina = "comunidade";
        $rootScope.titulo = "Comunidade";
        $scope.modalidades = [
            {'nome': 'Clube de Remo', 'slug': 'clube-remo', 'ativo': true},
            {'nome': 'CrossFit', 'slug': 'crossfit', 'ativo': true},
            {'nome': 'Musculação', 'slug': 'musculacao', 'ativo': true},
            {'nome': 'Aula Coletiva', 'slug': 'aula-coletiva', 'ativo': true}
        ];
        $scope.map = { center: {latitude: -14.235004, longitude: -51.92528}, zoom: 4 };
        var adicionaIcone = function() {
            angular.forEach($scope.ondeRemar, function(local) {
                local.icone = '/static/img/comunidade/mini/{0}.png'.format([local.modalidade]);
            });
        };
        $scope.ondeRemar = OndeRemar.query(adicionaIcone);
        var events = {
            places_changed: function (searchBox) {
                var place = searchBox.getPlaces();
                if (place.length == 0) {
                    return false;
                }
                place = place[0];
                $scope.map.center = {'latitude': place.geometry.location.lat(), 'longitude': place.geometry.location.lng()};
                $scope.map.zoom = 14;
            }
        };
        $scope.searchbox = { template: '/angular/comunidade/search-box.html', events:events};
        $scope.alternaTipo = function(modalidade) {
            modalidade.ativo = !modalidade.ativo;
            var modalidadesAtivas = [];
            angular.forEach($scope.modalidades, function(modalidade) {
                if (modalidade.ativo) {
                    modalidadesAtivas.push(modalidade.slug);
                }
            });
            if (modalidadesAtivas.length == 0) {
                $scope.ondeRemar = [];
            }
            else {
                $scope.ondeRemar = OndeRemar.query({'modalidade': modalidadesAtivas}, adicionaIcone);
            }
        }
    });
