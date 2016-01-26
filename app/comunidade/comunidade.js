'use strict';
angular.module('concept.comunidade', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
          .when('/comunidade', {
            templateUrl: 'comunidade/comunidade.html',
            controller: 'ComunidadeController'
          })
    }])
 .controller('ComunidadeController', ['$rootScope','$scope', '$http', function($rootScope, $scope, $http) {
            $rootScope.cssPagina="pagina-comunidade"
            $rootScope.titulo="Comunidade"
    }]);
