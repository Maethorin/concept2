
'use strict';
angular.module('concept.contato', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
          .when('/contato', {
            templateUrl: '/angular/contato.html',
            controller: 'ContatoController'
          })
    }])
 .controller('ContatoController', ['$rootScope','$scope', '$http', function($rootScope, $scope, $http) {
        $rootScope.pagina = "contato";
        $rootScope.titulo = "Contato"
    }]);
