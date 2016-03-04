'use strict';
angular.module('concept2.produtos', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
          .when('/produtos', {
            templateUrl: '/angular/produtos.html',
            controller: 'ProdutosController'
          })
          .when('/produtos/modeloD', {
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
     $rootScope.pagina = "produtos";
     $rootScope.titulo = "Produtos";

})