
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
        $scope.noticias = []
        $http.get('/noticias/noticias.json').then(function(response){
            $scope.noticias = response.data;
        });
    }]);
