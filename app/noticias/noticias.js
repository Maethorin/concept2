
'use strict';
angular.module('concept.noticias', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
          .when('/noticias', {
            templateUrl: 'noticias/noticias.html',
            controller: 'NoticiasController'
          })
    }])
 .controller('NoticiasController', ['$rootScope','$scope', '$http', function($rootScope,$scope, $http) {
     $rootScope.cssPagina = "pagina-noticias";
        $rootScope.titulo = "Noticias"
    }]);
