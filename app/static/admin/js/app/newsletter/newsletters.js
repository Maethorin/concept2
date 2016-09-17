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
        $scope.itemSelecionado = null;
        $scope.selecionaItem = function(item) {
            $scope.itemSelecionado = item;
        };
        $scope.removeNewsletter = function(newsletter) {
            Newsletter.delete(
                {id: newsletter.id},
                function() {
                    var index = _.findIndex($scope.lista, function(item) {
                        return item.id == newsletter.id
                    });
                    $scope.lista.splice(index, 1);
                }
            );
        };
    }]);

