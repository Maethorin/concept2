'use strict';

angular.module('concept2Admin.noticias', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/noticias', {
                templateUrl: '{0}/angular/crud/noticias-lista.html'.format([urlBackEnd]),
                controller: 'NoticiasController'
            })
            .when('/noticias/:id', {
                templateUrl: '{0}/angular/crud/noticias-elemento.html'.format([urlBackEnd]),
                controller: 'NoticiaController'
            });
    }])
    .controller("NoticiasController", ['$rootScope', '$scope', 'Noticia', function($rootScope, $scope, Noticia) {
        $rootScope.pagina = "noticias";
        $rootScope.titulo = "noticias";
        $scope.lista = Noticia.query();
        $scope.itemSelecionado = null;
        $scope.selecionaItem = function(item) {
            $scope.itemSelecionado = item;
        };
        $scope.removeItem = function(item) {
            Noticia.delete(
                {id: item.id},
                function() {
                    var index = _.findIndex($scope.lista, function(item) {
                        return item.id == item.id
                    });
                    $scope.lista.splice(index, 1);
                }
            );
        };
    }])
    .controller("NoticiaController", ['$rootScope', '$routeParams', '$scope', 'Noticia', function($rootScope, $routeParams, $scope, Noticia) {
        $scope.noticiaId = $routeParams.noticiaId;
        $rootScope.pagina = "noticia";
        $rootScope.titulo = "Noticia";
        $scope.noticia = Noticia.get({id: $scope.noticiaId});
    }]);


