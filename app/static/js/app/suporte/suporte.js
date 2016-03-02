
'use strict';
angular.module('concept2.suporte', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
          .when('/suporte', {
            templateUrl: '/angular/suporte.html',
            controller: 'SuporteController'
          })
    }])
 .controller('SuporteController', ['$rootScope','$scope', '$http', function($rootScope, $scope, $http) {
     $rootScope.pagina = "suporte";
        $rootScope.titulo = "Suporte"
    }]);
