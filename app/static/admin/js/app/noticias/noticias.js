'use strict';

angular.module('concept2Admin.noticias', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/noticias', {
                templateUrl: '{0}/angular/crud/noticia/lista.html'.format([urlBackEnd]),
                controller: 'NoticiasController'
            })
            .when('/noticias/nova', {
                templateUrl: '{0}/angular/crud/noticia/elemento.html'.format([urlBackEnd]),
                controller: 'NoticiaNovaController'
            })
            .when('/noticias/:id', {
                templateUrl: '{0}/angular/crud/noticia/elemento.html'.format([urlBackEnd]),
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
    .controller("NoticiaController", ['$rootScope', '$routeParams', '$scope', '$location', 'Noticia', function($rootScope, $routeParams, $scope, $location, Noticia) {
        $scope.noticiaId = $routeParams.id;
        $rootScope.pagina = "noticia";
        $rootScope.titulo = "Noticia";
        $scope.exibePublicar = true;
        $scope.noticia = Noticia.get(
            {id: $scope.noticiaId},
            function() {
                $scope.labelPublicar = $scope.noticia.publicado ? 'Despublicar' : 'Publicar';
            }
        );
        $scope.erro = null;
        $scope.publicar = function(status) {
            $scope.noticia.publicado = !status;
            $scope.gravar();
        };
        $scope.gravar = function() {
            $scope.erro = null;
            $scope.noticia.$update({id: $scope.noticiaId}).then(
                function() {
                    $location.path('/noticias');
                },
                function(response) {
                    $scope.erro = {
                        codigo: response.status,
                        conteudo: response
                    }
                }
            );
        };
    }])
    .controller("NoticiaNovaController", ['$rootScope', '$scope', '$location', 'Noticia', function($rootScope, $scope, $location, Noticia) {
        $rootScope.pagina = "noticia";
        $rootScope.titulo = "Nova Noticia";
        $scope.noticia = new Noticia();
        $scope.erro = null;
        $scope.gravar = function() {
            $scope.erro = null;
            $scope.noticia.$save().then(
                function(response) {
                    $location.path('/noticias/{0}'.format([response.id]));
                },
                function(response) {
                    $scope.erro = {
                        codigo: response.status,
                        conteudo: response
                    }
                }
            );
        }
    }]);


