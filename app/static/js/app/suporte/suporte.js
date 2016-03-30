
'use strict';
angular.module('concept2.suporte', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
          .when('/suporte', {
            templateUrl: '{0}/angular/suporte.html'.format([urlBackEnd]),
            controller: 'SuporteController'
          })
          .when('/suporte/:slug',{
           templateUrl: '{0}/angular/suporte/download.html'.format([urlBackEnd]),
           controller: 'DownloadController'
        })

    }])
 .controller('SuporteController', ['$rootScope','$scope', '$http', function($rootScope, $scope, $http) {
     $rootScope.pagina = "suporte";
        $rootScope.titulo = "Suporte"
    }])
.controller('DownloadController', ['$routeParams', '$rootScope', '$scope', '$sce', function($routeParams, $rootScope, $scope, $sce){
         $scope.slug = $routeParams.slug;
         $scope.downloadTemplate = '{0}/angular/suporte/{1}/download.html'.format([urlBackEnd, $scope.slug]);
         $rootScope.pagina = "suporte";
         $scope.trataHtml = function(html) {
            return $sce.trustAsHtml(html);
        };
    }]);