'use strict';
angular.module('concept2.produtos', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
          .when('/produtos', {
            templateUrl: '{0}/angular/produtos.html'.format([urlBackEnd]),
            controller: 'ProdutosController'
          })
          .when('/produtos/:slug', {
              templateUrl: '{0}/angular/produtos/modelod.html'.format([urlBackEnd]),
              controller: 'ModeloController'
          })
          .when('/produtos/:slug/:modeloMenu', {
             templateUrl: '{0}/angular/produtos/modelod.html'.format([urlBackEnd]),
              controller: 'ModeloController'
          })
    }])
 .controller('ProdutosController', ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {
        $rootScope.pagina = "produtos";
        $rootScope.titulo = "Produtos"
    }])
.controller('ModeloController', function($routeParams, $rootScope, $scope, $sce){
     $scope.slug = $routeParams.slug;
     $scope.modeloMenu = $routeParams.modeloMenu || 'sobre';
     $scope.template = '{0}/angular/produtos/{1}.html'.format([urlBackEnd, $scope.modeloMenu]);
     $rootScope.pagina = "produtos";
     $scope.modelosMenu = [
         {"slug": "sobre", "nome": "Sobre"},
         {"slug":  "caracteristicas" , "nome": "Características"},
         {"slug":  "especificacoes" , "nome": "Especificações"}
     ];
  $scope.trataHtml = function(html) {
            return $sce.trustAsHtml(html);
        };
});