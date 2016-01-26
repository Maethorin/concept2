
'use strict';
angular.module('concept.suporte', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
          .when('/suporte', {
            templateUrl: 'suporte/suporte.html',
            controller: 'SuporteController'
          })
    }])
 .controller('SuporteController', ['$scope', '$http', function($scope, $http) {

    }]);
