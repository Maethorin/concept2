'use strict';

angular.module('concept2Admin.noticias', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/noticias', {
                templateUrl: '{0}/angular/crud/noticia/lista.html'.format([urlBackEnd]),
                controller: 'NoticiasController'
            })
            .when('/noticias/nova', {
                templateUrl: '{0}/angular/crud/noticia/elemento.html'.format([urlBackEnd]),
                controller: 'NoticiaNovaController'
            })
            .when('/noticias/:id', {
                templateUrl: '{0}/angular/crud/noticia/elemento.html'.format([urlBackEnd]),
                controller: 'NoticiaController'
            });
    }])
    .controller("NoticiasController", ['$rootScope', '$scope', 'Noticia', 'Carregando', function($rootScope, $scope, Noticia, Carregando) {
        $rootScope.pagina = "noticias";
        $rootScope.titulo = "noticias";
        Carregando.show();
        $scope.lista = Noticia.query(function() {
            Carregando.hide();
        });
        $scope.itemSelecionado = null;
        $scope.pesquisa = '';
        $scope.pesquisar = function(noticia) {
            function valorIgual(valor) {
                return valor.toLowerCase().indexOf($scope.pesquisa.toLowerCase()) > -1;
            }
            return valorIgual(noticia.titulo) || valorIgual(noticia.resumo);
        };
        $scope.selecionaItem = function(item) {
            $scope.itemSelecionado = item;
        };
        $scope.removeItem = function(item) {
            Noticia.delete(
                {id: item.id},
                function() {
                    var index = _.findIndex($scope.lista, function(item) {
                        return item.id == item.id
                    });
                    $scope.lista.splice(index, 1);
                }
            );
        };
    }])
    .controller("NoticiaController", ['$rootScope', '$routeParams', '$scope', '$location', '$route', 'Upload', 'Noticia', 'NoticiaImagem', 'Carregando', function($rootScope, $routeParams, $scope, $location, $route, Upload, Noticia, NoticiaImagem, Carregando) {
        $scope.noticiaId = $routeParams.id;
        $rootScope.pagina = "noticia";
        $rootScope.titulo = "Noticia";
        $scope.modoEdicao = true;
        Carregando.show();
        $scope.noticia = Noticia.get(
            {id: $scope.noticiaId},
            function() {
                $scope.labelPublicar = $scope.noticia.publicado ? 'Despublicar' : 'Publicar';
                Carregando.hide();
            }
        );
        $scope.erro = null;
        $scope.publicar = function(status) {
            $scope.noticia.publicado = !status;
            $scope.gravar();
        };
        $scope.gravar = function() {
            Carregando.show();
            $scope.erro = null;
            $scope.noticia.$update({id: $scope.noticiaId}).then(
                function() {
                    $location.path('/noticias');
                },
                function(response) {
                    Carregando.hide();
                    $scope.erro = {
                        codigo: response.status,
                        conteudo: response
                    }
                }
            );
        };
        $scope.enviaThumbnail = function(file, errFiles) {
            Carregando.show();
            if (file) {
                file.upload = Upload.upload({
                    url: '{0}/api/noticias/imagens'.format([urlBackEnd]),
                    data: {imagem: file, noticia: $scope.noticia.id, tipo: 'thumbnail'}
                });
                file.upload.then(
                    function() {
                        $route.reload();
                    },
                    function() {
                        alert('Erro');
                    }
                );
            }
        };
        $scope.enviaImagem = function(file, errFiles) {
            Carregando.show();
            if (file) {
                file.upload = Upload.upload({
                    url: '{0}/api/noticias/imagens'.format([urlBackEnd]),
                    data: {imagem: file, noticia: $scope.noticia.id, tipo: file.name}
                });
                file.upload.then(
                    function() {
                        $route.reload();
                    },
                    function() {
                        alert('Erro');
                    }
                );
            }
        };

        $scope.removeImagem = function(imagemUrl) {
            var fileName = _.last(imagemUrl.split('/'));
            NoticiaImagem.delete(
                {id: $scope.noticia.id, fileName: fileName},
                function() {
                    var index = _.findIndex($scope.noticia.imagensUrls, function(noticiaImagemUrl) {
                        return noticiaImagemUrl == imagemUrl;
                    });
                    $scope.noticia.imagensUrls.splice(index, 1);
                },
                function(response) {
                    alert('Erro');
                    console.log(response);
                }
            );
        }
    }])
    .controller("NoticiaNovaController", ['$rootScope', '$scope', '$location', 'Noticia', 'Carregando', function($rootScope, $scope, $location, Noticia, Carregando) {
        $rootScope.pagina = "noticia";
        $rootScope.titulo = "Nova Noticia";
        $scope.noticia = new Noticia();
        $scope.erro = null;
        $scope.gravar = function() {
            Carregando.show();
            $scope.erro = null;
            $scope.noticia.$save().then(
                function(response) {
                    $location.path('/noticias/{0}'.format([response.id]));
                },
                function(response) {
                    $scope.erro = {
                        codigo: response.status,
                        conteudo: response
                    }
                }
            );
        }
    }]);

// $(function() {
//     $('.grid').masonry({
//       itemSelector: '.grid-item',
//       columnWidth: 200
//     });
// });