'use strict';
angular.module('concept2.produtos', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
          .when('/produtos', {
            templateUrl: '/angular/produtos.html',
            controller: 'ProdutosController'
          })
          .when('/produtos/:slug', {
              templateUrl: '/angular/produtos/modelod.html',
              controller: 'ModeloController'
          })
          .when('/produtos/:slug/:modeloMenu', {
             templateUrl: '/angular/produtos/modelod.html',
              controller: 'ModeloController'
          })
    }])
 .controller('ProdutosController', ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {
        $rootScope.pagina = "produtos";
        $rootScope.titulo = "Produtos"
    }])
.controller('ModeloController', function($routeParams, $rootScope, $scope, $sce){
     $scope.slug = $routeParams.slug
     $scope.modeloMenu = $routeParams.modeloMenu || 'sobre';
     $scope.template = '/angular/produtos/{0}.html'.format([$scope.modeloMenu]);
     $rootScope.pagina = "produtos";
     $scope.modelosMenu = [
         {"slug": "sobre", "nome": "Sobre"},
         {"slug":  "caracteristicas" , "nome": "Características"},
         {"slug":  "especificacoes" , "nome": "Especificações"}
     ];
  $scope.trataHtml = function(html) {
            return $sce.trustAsHtml(html);
        };
})