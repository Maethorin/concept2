'use strict';

angular.module('concept2Admin.newsletters', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/newsletter', {
                templateUrl: '{0}/angular/crud/newsletters-lista.html'.format([urlBackEnd]),
                controller: 'NewslettersController'
            })
    }])
    .controller("NewslettersController", ['$rootScope', '$scope', 'Newsletter', function($rootScope, $scope, Newsletter) {
        $rootScope.pagina = "newsletter";
        $rootScope.titulo = "Newsletter";
        $scope.lista = Newsletter.query();
    }]);

