
'use strict';
angular.module('concept.eventos', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
          .when('/eventos', {
            templateUrl: 'eventos/eventos.html',
            controller: 'EventosController'
          })
    }])
 .controller('EventosController', ['$scope', '$http', function($scope, $http) {

    }]);