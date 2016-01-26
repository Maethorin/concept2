
'use strict';
angular.module('concept.contato', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
          .when('/contato', {
            templateUrl: 'contato/contato.html',
            controller: 'ContatoController'
          })
    }])
 .controller('ContatoController', ['$scope', '$http', function($scope, $http) {

    }]);
