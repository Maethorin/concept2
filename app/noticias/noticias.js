
'use strict';
angular.module('concept.noticias', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
          .when('/noticias', {
            templateUrl: 'noticias/noticias.html',
            controller: 'NoticiasController'
          })
    }])
 .controller('NoticiasController', ['$scope', '$http', function($scope, $http) {

    }]);
