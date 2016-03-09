
'use strict';
angular.module('concept2.suporte', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
          .when('/suporte', {
            templateUrl: '{0}/angular/suporte.html'.format([urlBackEnd]),
            controller: 'SuporteController'
          })
    }])
 .controller('SuporteController', ['$rootScope','$scope', '$http', function($rootScope, $scope, $http) {
     $rootScope.pagina = "suporte";
        $rootScope.titulo = "Suporte"
    }]);
