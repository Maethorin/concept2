
'use strict';
angular.module('concept.contato', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
          .when('/contato', {
            templateUrl: 'contato/contato.html',
            controller: 'ContatoController'
          })
    }])
 .controller('ContatoController', ['$rootScope','$scope', '$http', function($rootScope, $scope, $http) {
        $rootScope.cssPagina = "pagina-contato ";
        $rootScope.titulo = "Contato"
    }]);
