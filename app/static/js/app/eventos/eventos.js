'use strict';
angular.module('concept2.eventos', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/eventos', {
                templateUrl: '/angular/eventos.html',
                controller: 'EventosController'
            })
            .when('/eventos/:slug', {
                templateUrl: '/angular/evento/evento.html',
                controller: 'EventoController'
            })
            .when('/eventos/:slug/:itemMenu', {
                templateUrl: '/angular/evento/evento.html',
                controller: 'EventoController'
            })
    }])
    .directive('emailNaoUsado', function() {
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                ctrl.$validators.emailNaoUsado = function(modelValue, viewValue) {
                    return scope.mensagemErro != "Email já está cadastrado como atleta";
                };
            }
        };
    })
    .directive('igualSenha', function() {
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                ctrl.$validators.igualSenha = function(modelValue, viewValue) {
                    return scope.inscricao.senha == viewValue;
                };
            }
        };
    })
    .controller('EventosController', function($rootScope, $scope, $http, $sce, Evento) {
        $rootScope.pagina = "eventos";
        $rootScope.titulo = "Eventos";
        $scope.eventos = [];
        $scope.trataHtml = function(linha) {
            return $sce.trustAsHtml(linha);
        };
        $scope.eventos = Evento.query();
    })
    .controller('EventoController', function($rootScope, $scope, $routeParams, $http, $sce, Evento, Atleta) {
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
        $scope.colocacoes = [1, 2, 3, 4, 5, 6, 7, 8];
        $scope.regulamentos = [];
        $http.get('/static/js/app/jsons/regulamento.json').then(function(response) {
            $scope.regulamentos = response.data;
        });

        $scope.evento = Evento.get({"id": $scope.slug}, function() {
            $rootScope.titulo = $scope.evento.titulo;
            var mesInicio = new Date($scope.evento.dataInicio.ano, $scope.evento.dataInicio.mes - 1, $scope.evento.dataInicio.dia);
            var mesFim = new Date($scope.evento.dataFim.ano, $scope.evento.dataFim.mes - 1, $scope.evento.dataFim.dia);
            if (mesFim.getMonth() == mesInicio.getMonth()) {
                var mesNome = mesInicio.toLocaleString('pt-br', {month: "long"});
                if (mesFim.getDay() == mesInicio.getDay()) {
                    $scope.evento.duracao = 'dia {0} de {2}'.format([$scope.evento.dataInicio.dia, mesNome])
                }
                $scope.evento.duracao = 'de {0} a {1} de {2}'.format([$scope.evento.dataInicio.dia, $scope.evento.dataFim.dia, mesNome])
            }
            $scope.provasDropdownList = [];
            angular.forEach($scope.evento.provas, function(prova) {
                if (prova.distancia > 0) {
                    prova.selecionada = false;
                    $scope.provasDropdownList.push(prova);
                }
            });
        });
        $scope.campoProvaTocado = false;
        $scope.obterProva = function(provaSelecionada) {
            var provaCompleta = null;
            angular.forEach($scope.evento.provas, function(prova) {
                if (prova.id == provaSelecionada.id) {
                    provaCompleta = prova;
                    return false;
                }
            });
            return provaCompleta;
        };
        $scope.removeProva = function(provaId) {
            angular.forEach($scope.inscricao.provas, function(prova, index) {
                if (prova.id == provaId) {
                    $scope.inscricao.provas.splice(index, 1);
                    return false;
                }
            });
            angular.forEach($scope.provasDropdownList, function(prova) {
                if (prova.id == provaId) {
                    prova.selecionada = false;
                    return false;
                }
            });
            if ($scope.inscricao.provas.length == 0) {
                $scope.inscricao.provaSelecionada = null;
            }
            $scope.campoProvaTocado = true;
        };
        $scope.provasEventos = {
            onItemSelect: function(prova) {
                $scope.inscricao.provas.push({'id': prova.id});
                $scope.inscricao.provaSelecionada = 1;
                $scope.campoProvaTocado = true;
            },
            onItemDeselect: function(prova) {
                $scope.removeProva(prova.id);
                if ($scope.inscricao.provas.length == 0) {
                    $scope.inscricao.provaSelecionada = null;
                }
                $scope.campoProvaTocado = true;
            }
        };
        $scope.clicaNaProva = function(selecionada, prova) {
            if (selecionada) {
                $scope.provasEventos.onItemSelect(prova);
            }
            else {
                $scope.provasEventos.onItemDeselect(prova);
            }
        };
        $scope.provasTexts = {
            buttonDefaultText: 'Selecione a(s) prova(s) que vai participar...'
        };
        $scope.provasSettings = {
            dynamicTitle: false,
            showCheckAll: false,
            showUncheckAll: false,
            scrollable: true,
            scrollableHeight: '300px'
        };
        $scope.reset = function(formInscricao) {
            $scope.atletaLogado = false;
            $scope.inscricao = new Atleta({
                "evento": $scope.evento.id,
                "nome": null,
                "sobrenome": null,
                "sexo": null,
                "senha": null,
                "confirmeSenha": null,
                "nascimento": null,
                "cpf": null,
                "email": null,
                "telefone": null,
                "celular": null,
                "time": null,
                "tipoAfiliacao": null,
                "afiliacao": null,
                "provas": [],
                "provaSelecionada": null
            });
            if (formInscricao) {
                formInscricao.$setPristine();
                formInscricao.$setUntouched();
            }
            $scope.campoProvaTocado = false;
        };
        $scope.reset();
        $scope.selecionaTipoAfiliacao = function(tipoFiliacao) {
            $scope.inscricao.tipoAfiliacao = tipoFiliacao;
        };
        $scope.maskDef = {'maskDefinitions': {'9': /\d/, 'D': /[0-3]/, 'd': /[0-9]/, 'M': /[0-1]/, 'm': /[0-2]/}};

        $scope.verificaErro = function(campo, validacao, status) {
            if (!campo) {
                return false;
            }
            if (!validacao) {
                validacao = 'required'
            }
            var statusCampo = campo.$touched || campo.$dirty;
            if (status != 'undefined') {
                statusCampo = status || campo.$dirty
            }
            return statusCampo && campo.$error[validacao];
        };

        $scope.campoEstaValido = function(campo) {
            var valido = true;
            if (campo.$name == 'email') {
                valido = !campo.$error.email;
            }
            var statusCampo = (campo.$touched || campo.$dirty);
            if (campo.$name == 'provas') {
                statusCampo = $scope.campoProvaTocado || campo.$dirty;
            }
            return statusCampo && !campo.$error.required && valido;

        };
        $scope.campoEstaInvalido = function(campo) {
            var temErro = $scope.verificaErro(campo);
            if (campo.$name == 'email') {
                temErro |= $scope.verificaErro(campo, 'email');
            }
            if (campo.$name == 'senha') {
                temErro |= $scope.verificaErro(campo, 'minlength');
            }
            if (_.includes(['cpf', 'celular', 'nascimento'], campo.$name)) {
                temErro |= $scope.verificaErro(campo, 'mask');
            }
            if (campo.$name == 'confirmeSenha') {
                temErro |= $scope.verificaErro(campo, 'igualSenha');
            }
            if (campo.$name == 'provas') {
                temErro = $scope.verificaErro(campo, null, $scope.campoProvaTocado);
            }
            return temErro;
        };
        $scope.campoNaoTocado = function(campo) {
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
            $scope.inscricao.$save();
        };
    });
