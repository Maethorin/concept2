'use strict';
angular.module('concept2.eventos', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/eventos', {
                templateUrl: '/angular/eventos.html',
                controller: 'EventosController'
            })
             .when('/eventos/:slug', {
                templateUrl: '/angular/evento/evento.html',
                controller:'EventoController'
            })
            .when('/eventos/:slug/:itemMenu', {
                templateUrl: '/angular/evento/evento.html',
                controller:'EventoController'
            })
    }])
    .controller('EventosController', function ($rootScope, $scope, $http, $sce, Evento) {
        $rootScope.pagina = "eventos";
        $rootScope.titulo = "Eventos";
        $scope.eventos = [];
        $scope.trataHtml = function(linha) {
            return $sce.trustAsHtml(linha);
        };
        $scope.eventos = Evento.query();
    })
    .controller('EventoController', function ($rootScope, $scope, $routeParams, $http, $sce, Evento) {
        $scope.slug = $routeParams.slug;
        $scope.itemMenu = $routeParams.itemMenu || 'sobre';
        $scope.template = '/angular/evento/{0}.html'.format([$scope.itemMenu]);
        $rootScope.pagina = "eventos";
        $scope.itensMenu = [
            {"slug": "sobre", "nome": "Sobre"},
            {"slug": "categorias", "nome": "Categorias"},
            {"slug": "horarios", "nome": "Horários"},
            {"slug": "regulamento", "nome": "Regulamento"},
            {"slug": "resultados", "nome": "Resultados"},
            {"slug": "inscricao", "nome": "Inscreva-se"}
        ];
        $scope.trataHtml = function(html) {
            return $sce.trustAsHtml(html);
        };
        $scope.evento = Evento.get({"id": $scope.slug}, function() {
            $rootScope.titulo = $scope.evento.titulo;
            var mesInicio = new Date($scope.evento.dataInicio.ano, $scope.evento.dataInicio.mes - 1, $scope.evento.dataInicio.dia);
            var mesFim = new Date($scope.evento.dataFim.ano, $scope.evento.dataFim.mes - 1, $scope.evento.dataFim.dia);
            if (mesFim.getMonth() == mesInicio.getMonth()) {
                var mesNome = mesInicio.toLocaleString('pt-br', { month: "long"});
                if (mesFim.getDay() == mesInicio.getDay()) {
                    $scope.evento.duracao = 'dia {0} de {2}'.format([$scope.evento.dataInicio.dia, mesNome])
                }
                $scope.evento.duracao = 'de {0} a {1} de {2}'.format([$scope.evento.dataInicio.dia, $scope.evento.dataFim.dia, mesNome])
            }
        });
        $scope.regulamentos =[];
        $http.get('/static/js/app/jsons/regulamento.json').then(function(response) {
            $scope.regulamentos = response.data;
        });

        $scope.reset = function(formInscricao) {
            $scope.dadosInscricao = {
                "nome": null,
                "sobrenome": null,
                "sexo": null,
                "data": null,
                "cpf": null,
                "email": null,
                "telefone": null,
                "celular": null,
                "time": null,
                "tipoAfiliacao": null,
                "afiliacao": null,
                "prova": null
            };
            if (formInscricao) {
                formInscricao.$setPristine();
                formInscricao.$setUntouched();
            }
        };
        $scope.reset();
        $scope.selecionaTipoAfiliacao = function(tipoFiliacao) {
            $scope.dadosInscricao.tipoAfiliacao = tipoFiliacao;
        };
        $scope.maskDef = {'maskDefinitions': {'9': /\d/, 'D': /[0-3]/, 'd': /[0-9]/, 'M': /[0-1]/, 'm': /[0-2]/}};
        $scope.campoEstaValido = function (campo) {
            if (campo.$name == 'email') {
                return (campo.$touched || campo.$dirty) && !campo.$error.required && !campo.$error.email;
            }
            return (campo.$touched || campo.$dirty) && !campo.$error.required

        };
        $scope.campoEstaInvalido = function (campo) {
            if (campo.$name == 'email') {
                return (campo.$touched || campo.$dirty) && (campo.$error.required || campo.$error.email);
            }
            return (campo.$touched || campo.$dirty) && campo.$error.required;
        };
        $scope.campoNaoTocado = function (campo) {
            return !campo.$touched
        };
        function exibeValidacoes(formInscricao) {
            angular.forEach(formInscricao, function(field, fieldName) {
                if (field !== undefined && field.$validate !== undefined) {
                    field.$validate();
                    field.$setDirty();
                }
            });
        }
        $scope.enviandoInscricao = function(formInscricao) {
            if (formInscricao.$invalid) {
                formInscricao.$setPristine();
                exibeValidacoes(formInscricao);
                return false;
            }
        }
    });
