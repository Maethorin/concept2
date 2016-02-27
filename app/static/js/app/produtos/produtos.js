'use strict';
angular.module('concept.produtos', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
          .when('/produtos', {
            templateUrl: '/angular/produtos.html',
            controller: 'ProdutosController'
          })
    }])
 .controller('ProdutosController', ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {
        $rootScope.pagina = "produtos";
        $rootScope.titulo = "Produtos"
    }]);