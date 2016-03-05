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
    }])
 .controller('ProdutosController', ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {
        $rootScope.pagina = "produtos";
        $rootScope.titulo = "Produtos"
    }])
.controller('ModeloController', function($routeParams, $rootScope, $scope, $http){
     $scope.slug = $routeParams.slug
     $scope.modeloMenu = $routeParams.modeloMenu || 'sobre';
     $rootScope.pagina = "produtos";
     $rootScope.titulo = "Produtos";
     $scope.template = 'angular/produtos/modelod/{0}.html'.format([$scope.modeloMenu])
     $scope.menu = [
         {"slug": "sobre", "nome": "Sobre"},
         {"slug": "caracteristicas", "nome": "Características"}

             ]

})