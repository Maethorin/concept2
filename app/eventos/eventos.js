
'use strict';
angular.module('concept.eventos', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
          .when('/eventos', {
            templateUrl: 'eventos/eventos.html',
            controller: 'EventosController'
          })
    }])
 .controller('EventosController', ['$rootScope','$scope', '$http', function($rootScope,$scope, $http) {
        $rootScope.cssPagina = "pagina-eventos";
        $rootScope.titulo = "Eventos";
        $scope.eventos = []
        $http.get('/eventos/eventos.json').then(function(response){
        $scope.eventos = response.data;
        });
    }]);
