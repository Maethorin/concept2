'use strict';

angular.module('concept2Admin.newsletters', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/newsletters', {
                templateUrl: '{0}/angular/crud/newsletter/lista.html'.format([urlBackEnd]),
                controller: 'NewslettersController'
            })
    }])
    .controller("NewslettersController", ['$rootScope', '$scope', 'Newsletter', function($rootScope, $scope, Newsletter) {
        $rootScope.pagina = "newsletters";
        $rootScope.titulo = "Newsletters";
        $scope.lista = Newsletter.query();
        $scope.itemSelecionado = null;
        $scope.selecionaItem = function(item) {
            $scope.itemSelecionado = item;
        };
        $scope.removeItem = function(item) {
            Newsletter.delete(
                {id: item.id},
                function() {
                    var index = _.findIndex($scope.lista, function(item) {
                        return item.id == item.id
                    });
                    $scope.lista.splice(index, 1);
                }
            );
        };
    }]);

