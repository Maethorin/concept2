
'use strict';
angular.module('concept.suporte', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
          .when('/suporte', {
            templateUrl: '/angular/suporte.html',
            controller: 'SuporteController'
          })
    }])
 .controller('SuporteController', ['$rootScope','$scope', '$http', function($rootScope, $scope, $http) {
     $rootScope.cssPagina = "pagina-suporte";
        $rootScope.titulo = "Suporte"
    }]);
