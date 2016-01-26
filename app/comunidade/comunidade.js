'use strict';
angular.module('concept.comunidade', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
          .when('/comunidade', {
            templateUrl: 'comunidade/comunidade.html',
            controller: 'ComunidadeController'
          })
    }])
 .controller('ComunidadeController', ['$scope', '$http', function($scope, $http) {

    }]);
