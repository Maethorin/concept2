'use strict';
angular.module('concept2.noticias', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/noticias', {
                templateUrl: '{0}/angular/noticias/lista.html'.format([urlBackEnd]),
                controller: 'NoticiasController'
            })
            .when('/noticias/:slug', {
                templateUrl: '{0}/angular/noticias/elemento.html'.format([urlBackEnd]),
                controller: 'NoticiaController'
            });
    }])
    .controller('NoticiasController', ['$rootScope', '$scope', 'Noticia', function($rootScope, $scope, Noticia) {
        $rootScope.pagina = "noticias";
        $rootScope.titulo = "Noticias";
        Noticia.query(function(response) {
            $scope.linhas = [];
            var noticias = response;
            var colunas = [];
            _.forEach(noticias, function(noticia, index) {
                colunas.push(noticia);
                if (colunas.length == 2) {
                    $scope.linhas.push(colunas);
                    colunas = [];
                    colunas = [];
                }
            });
            if (colunas.length == 1) {
                colunas.push({titulo:''});
                $scope.linhas.push(colunas);
            }
            else if (colunas.length == 2) {
                $scope.linhas.push(colunas);
            }
        });
    }])
    .controller('NoticiaController', ['$rootScope', '$scope', '$routeParams', '$sce', 'Noticia', function($rootScope, $scope, $routeParams, $sce, Noticia) {
        var noticiaSlug = $routeParams.slug;
        $scope.noticia = Noticia.get({slug: noticiaSlug}, function(noticia) {
            $scope.noticia.corpo = $sce.trustAsHtml(noticia.corpo);
        });
        $rootScope.pagina = "noticias";
        $rootScope.titulo = "Noticia";
    }]);
