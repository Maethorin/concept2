'use strict';
angular.module('concept.produtos', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
          .when('/produtos', {
            templateUrl: 'produtos/produtos.html',
            controller: 'ProdutosController'
          })
    }])
 .controller('ProdutosController', ['$scope', '$http', function($scope, $http) {

    }]);