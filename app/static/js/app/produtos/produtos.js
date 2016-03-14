'use strict';
angular.module('concept2.produtos', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/produtos', {
                templateUrl: '{0}/angular/produtos.html'.format([urlBackEnd]),
                controller: 'ProdutosController'
            })
            .when('/produtos/:slug', {
                templateUrl: '{0}/angular/produtos/produto.html'.format([urlBackEnd]),
                controller: 'ProdutoController'
            })
            .when('/produtos/:slug/:modeloMenu', {
                templateUrl: '{0}/angular/produtos/produto.html'.format([urlBackEnd]),
                controller: 'ProdutoController'
            })

    }])
    .controller('ProdutosController', ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {
        $rootScope.pagina = "produtos";
        $rootScope.titulo = "Produtos"
    }])
    .controller('ProdutoController', ['$routeParams', '$rootScope', '$scope', '$sce', function($routeParams, $rootScope, $scope, $sce) {
        $scope.slug = $routeParams.slug;
        $scope.modeloMenu = $routeParams.modeloMenu || 'sobre';
        $scope.produtoTemplate = '{0}/angular/produtos/{1}/produto.html'.format([urlBackEnd, $scope.slug]);
        $scope.subTemplate = '{0}/angular/produtos/{1}/{2}.html'.format([urlBackEnd, $scope.slug, $scope.modeloMenu]);
        $rootScope.pagina = "produtos";
        $scope.modelosMenu = [
            {"slug": "sobre", "nome": "Sobre"},
            {"slug": "caracteristicas", "nome": "Características"},
            {"slug": "especificacoes", "nome": "Especificações"}
        ];
        $scope.trataHtml = function(html) {
            return $sce.trustAsHtml(html);
        };
    }]);