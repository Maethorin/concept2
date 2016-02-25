'use strict';
angular.module('concept.produtos', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
          .when('/produtos', {
            templateUrl: 'produtos/produtos.html',
            controller: 'ProdutosController'
          })
    }])
 .controller('ProdutosController', ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {
        $rootScope.cssPagina = "pagina-produtos";
        $rootScope.titulo = "Produtos"
    }]);