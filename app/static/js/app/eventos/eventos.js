'use strict';
angular.module('concept2.eventos', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/eventos', {
                templateUrl: '{0}/angular/eventos.html'.format([urlBackEnd]),
                controller: 'EventosController'
            })
            .when('/eventos/:slug', {
                templateUrl: '{0}/angular/evento/evento.html'.format([urlBackEnd]),
                controller: 'EventoController'
            })
            //TODO: remover isso depois que acabar o cabra-ri
            .when('/eventos/cabra-ri/inscricao', {redirectTo: '/eventos/cabra-ri/provas'})
            .when('/eventos/:slug/:itemMenu', {
                templateUrl: '{0}/angular/evento/evento.html'.format([urlBackEnd]),
                controller: 'EventoController'
            })
    }])
    .directive('emailNaoUsado', function() {
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                ctrl.$validators.emailNaoUsado = function(modelValue, viewValue) {
                    return scope.mensagemErro != "Email já está cadastrado como atleta.";
                };
            }
        };
    })
    .directive('cpfValido', function() {
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                ctrl.$validators.cpfValido = function(modelValue, viewValue) {
                    if (!viewValue) {
                        return false;
                    }
                    var strCPF = viewValue.replace(/\./g, '').replace(/_/g, '').replace(/\-/g, '');
                    var soma;
                    var resto;
                    soma = 0;
                    if (strCPF == "00000000000") {
                        return false;
                    }
                    for (var i = 1; i <= 9; i++) {
                        soma = soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
                    }
                    resto = (soma * 10) % 11;
                    if ((resto == 10) || (resto == 11)) {
                        resto = 0;
                    }
                    if (resto != parseInt(strCPF.substring(9, 10)) ) {
                        return false;
                    }
                    soma = 0;
                    for (i = 1; i <= 10; i++) {
                        soma = soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
                    }
                    resto = (soma * 10) % 11;
                    if ((resto == 10) || (resto == 11)) {
                        resto = 0;
                    }
                    return resto == parseInt(strCPF.substring(10, 11));
                };
            }
        };
    })
    .directive('igualSenha', function() {
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                ctrl.$validators.igualSenha = function(modelValue, viewValue) {
                    if (scope.atleta) {
                        return scope.atleta.senha == viewValue;
                    }
                };
            }
        };
    })
    .directive('nascimentoCorreto', function() {
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                ctrl.$validators.nascimentoCorreto = function(modelValue, viewValue) {
                    try {
                        var dataArray = viewValue.split('/');
                        var dia = parseInt(dataArray[0]);
                        if (dia > 31) {
                            return false;
                        }
                        var mes = parseInt(dataArray[1]);
                        var ano = parseInt(dataArray[2]);
                        if (mes == 2) {
                            if (dia > 29) {
                                return false;
                            }
                            var ehAnoBisexto = ((ano % 4 == 0) && (ano % 100 != 0)) || (ano % 400 == 0);
                            if (!ehAnoBisexto && dia > 28) {
                                return false;
                            }
                        }
                        var hoje = new Date();
                        var anoHoje = hoje.getFullYear();
                        var nascimento = new Date(ano, mes - 1, dia);
                        var dataMinima = new Date(anoHoje - 100, hoje.getMonth(), hoje.getDay());
                        var dataMaxima = new Date(anoHoje - 9, hoje.getMonth(), hoje.getDay());
                        return nascimento >= dataMinima && nascimento <= dataMaxima;
                    }
                    catch (ex) {
                        return false;
                    }
                };
            }
        };
    })
    .controller('EventosController', ['$rootScope', '$scope', '$http', '$sce', 'Evento', function($rootScope, $scope, $http, $sce, Evento) {
        $rootScope.pagina = "eventos";
        $rootScope.titulo = "Eventos";
        $scope.eventos = [];
        $scope.trataHtml = function(linha) {
            return $sce.trustAsHtml(linha);
        };
        $scope.eventos = Evento.query();
    }])
    .controller('EventoController', ['$rootScope', '$scope', '$routeParams', '$http', '$sce', '$filter', '$window', '$location', 'Evento', 'Atleta', 'Inscricao', 'Autentic', 'Upload', function($rootScope, $scope, $routeParams, $http, $sce, $filter, $window, $location, Evento, Atleta, Inscricao, Autentic, Upload) {
        $scope.estaCarregando = false;
        $scope.slug = $routeParams.slug;
        $scope.itemMenu = $routeParams.itemMenu || 'sobre';
        $scope.template = '{0}/angular/evento/{1}.html'.format([urlBackEnd, $scope.itemMenu]);
        $scope.maskDef = {'maskDefinitions': {'9': /\d/, 'D': /[0-3]/, 'd': /[0-9]/, 'M': /[0-1]/, 'm': /[0-2]/}};
        $scope.temProvas = true;
        $scope.temCursos = true;
        $scope.exibeProvas = true;
        $scope.exibeCursos = true;
        $rootScope.pagina = "eventos";
        $scope.exibeAjuda = function(seletor) {
            var $ajudaPopOver = $(seletor);
            $ajudaPopOver.popover();
            $ajudaPopOver.popover('toggle');
        };
        $scope.itensMenu = [
            {"slug": "sobre", "nome": "Sobre"},
            {"slug": "horarios", "nome": "Horários"},
            {"slug": "regulamento", "nome": "Regulamento"},
            {"slug": "provas", "nome": "Provas"},
            {"slug": "cursos", "nome": "Cursos"},
            {"slug": "resultados", "nome": "Resultados"}
        ];
        $scope.trataHtml = function(html) {
            return $sce.trustAsHtml(html);
        };
        $scope.colocacoes = [1, 2, 3, 4, 5, 6, 7, 8];
        function exibeValidacoes(formInscricao) {
            angular.forEach(formInscricao, function(field, fieldName) {
                if (field !== undefined && field.$validate !== undefined) {
                    field.$validate();
                    field.$setDirty();
                }
            });
        }
        function onItemSelect(item, tipo) {
            $scope.atleta.inscricao[tipo].push({'id': item.id});
            if (tipo == 'provas') {
                $scope.atleta.provaSelecionada = 1;
                $scope.campoProvaTocado = true;
            }
            if (tipo == 'cursos') {
                $scope.atleta.cursoSelecionado = 1;
                $scope.campoCursoTocado = true;
                $scope.defineUrlPagamentoCurso();
            }
        }
        $scope.formataDuracao = function(duracao) {
            var horas = parseInt(duracao / 60);
            var minutos = duracao % 60;
            return '{0}h{1}min'.format([horas, minutos]);
        };
        $scope.formataValor = function(valor) {
            var reais = parseInt(valor / 100);
            var centavos = valor % 100;
            if (centavos < 10) {
                centavos = '0{0}'.format([centavos]);
            }
            return 'R$ {0},{1}'.format([reais, centavos]);
        };
        $scope.evento = Evento.get({"id": $scope.slug}, function() {
            $rootScope.titulo = $scope.evento.titulo;
            $scope.temProvas = $scope.evento.provas.length > 0;
            $scope.temCursos = $scope.evento.cursos.length > 0;
            $scope.exibeProvas = $scope.evento.provas.length > 0;
            $scope.exibeCursos = $scope.evento.cursos.length > 0;
            var dataInicio = new Date($scope.evento.dataInicio.ano, $scope.evento.dataInicio.mes - 1, $scope.evento.dataInicio.dia);
            var dataFim = new Date($scope.evento.dataFim.ano, $scope.evento.dataFim.mes - 1, $scope.evento.dataFim.dia);
            if (dataFim.getMonth() == dataInicio.getMonth()) {
                var mesNome = dataInicio.toLocaleString('pt-br', {month: "long"});
                if (dataFim.getDay() == dataInicio.getDay()) {
                    $scope.evento.duracao = 'dia {0} de {2}'.format([$scope.evento.dataInicio.dia, mesNome])
                }
                $scope.evento.duracao = 'de {0} a {1} de {2}'.format([$scope.evento.dataInicio.dia, $scope.evento.dataFim.dia, mesNome])
            }
            var dias = parseInt((dataFim - dataInicio) / (1000 * 60 * 60 * 24)) + dataInicio.getDate();
            $scope.datas = [];
            for (var i = dataInicio.getDate(); i <= dias; i++) {
                $scope.datas.push({
                    data: '{0}/{1}'.format([dataInicio.getDate(), dataInicio.getMonth() + 1]),
                    dia: '{0}, {1}{2} de {3}'.format([
                        dataInicio.nomeDia(),
                        i,
                        (i == 1 ? 'º' : ''),
                        dataInicio.nomeMes()
                    ]),
                    provas: []
                });
                dataInicio.setDate(dataInicio.getDate() + 1);
            }
            $scope.provasDropdownList = [];
            $scope.provaDaQueryString = null;
            angular.forEach($scope.evento.provas, function(prova) {
                angular.forEach($scope.datas, function(data) {
                    if (prova.dia.replace(/0/g, '') == data.data) {
                        data.provas.push(prova);
                    }
                });
                if (prova.distancia > 0) {
                    prova.selecionado = false;
                    $scope.provasDropdownList.push(prova);
                }
                var search = $location.search();
                if (search.hasOwnProperty('prova') && prova.codigo == search.prova) {
                    $scope.provaDaQueryString = prova;
                }
            });
            $scope.provasParaSelecao = angular.copy($scope.provasDropdownList);
            $scope.cursosDropdownList = [];
            angular.forEach($scope.evento.cursos, function(curso) {
                curso.selecionado = false;
                $scope.cursosDropdownList.push(curso);
            });
            if ($scope.itemMenu == 'provas' || $scope.itemMenu == 'cursos') {
                $scope.mensagemErro = '';
                $scope.urlPagamentoProvas = $scope.evento.urlPagamentoProvas;
                $scope.urlPagamentoCursos = [$scope.evento.urlPagamentoCursos];
                $scope.cadastroEmLote = false;
                $scope.atletasEmLote = [];
                $scope.urlArquivoEmLote = '{0}/angular/inscricao-lote.csv'.format([urlBackEnd]);
                $scope.enviaArquivoEmLote = function(file, errFiles) {
                    if (file) {
                        file.upload = Upload.upload({
                            url: '{0}/valida-lote'.format([urlBackEnd]),
                            data: {atletasEmLote: file}
                        });
                        file.upload.then(
                            function(response) {
                                $scope.atletasEmLote = response.data.atletasEmLote;
                                $scope.atletasEmLoteComErro = response.data.erros;
                            },
                            function(response) {
                                $scope.erroArquivoEmLote = response.data.mensagem;
                            }
                        );
                    }
                };
                $scope.defineUrlPagamentoCurso = function() {
                    if ($scope.evento.cursos.length == $scope.atleta.inscricao.cursos.length) {
                        $scope.urlPagamentoCursos = [$scope.evento.urlPagamentoCursos];
                    }
                    else {
                        $scope.urlPagamentoCursos = [];
                        angular.forEach($scope.evento.cursos, function(curso) {
                            angular.forEach($scope.atleta.inscricao.cursos, function(cursoEscolhido) {
                                if (curso.id == cursoEscolhido.id) {
                                    $scope.urlPagamentoCursos.push(curso.urlPagamento);
                                }
                            });
                        });
                    }
                };
                $scope.tiposAfiliacoes = [
                    {'codigo': 'clube', 'label': 'Clube'},
                    {'codigo': 'academia', 'label': 'Academia'},
                    {'codigo': 'box-cf', 'label': 'Box de CF'},
                    {'codigo': 'independente', 'label': 'Independente'}
                ];
                $scope.campoProvaTocado = false;
                $scope.campoCursoTocado = false;
                $scope.carregandoProvas = false;
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
                var limpaSelecaoProvas = function() {
                    angular.forEach($scope.provasDropdownList, function(prova) {
                        prova.selecionado = false;
                    });
                    $scope.atleta.inscricao.provas = [];
                    $scope.atleta.provaSelecionada = null;
                };
                $scope.obterItem = function(itemSelecionado, tipo) {
                    var itemCompleto = null;
                    angular.forEach($scope.evento[tipo], function(item) {
                        if (item.id == itemSelecionado.id) {
                            itemCompleto = item;
                            return false;
                        }
                    });
                    return itemCompleto;
                };
                $scope.removeItem = function(itemId, tipo) {
                    angular.forEach($scope.atleta.inscricao[tipo], function(item, index) {
                        if (item.id == itemId) {
                            $scope.atleta.inscricao[tipo].splice(index, 1);
                            return false;
                        }
                    });
                    angular.forEach($scope['{0}DropdownList'.format([tipo])], function(item) {
                        if (item.id == itemId) {
                            item.selecionado = false;
                            return false;
                        }
                    });
                    if (tipo == 'provas') {
                        if ($scope.atleta.inscricao.provas.length == 0) {
                            $scope.atleta.provaSelecionada = null;
                        }
                        $scope.campoProvaTocado = true;
                        $scope.provaDaQueryString = null;
                    }
                    if (tipo == 'cursos') {
                        if ($scope.atleta.inscricao.cursos.length == 0) {
                            $scope.atleta.cursoSelecionado = null;
                        }
                        $scope.campoCursoTocado = true;
                        $scope.defineUrlPagamentoCurso();
                    }
                };
                $scope.selecionaItens = function() {
                    angular.forEach($scope.provasDropdownList, function(prova) {
                        prova.selecionado = false;
                        if ($scope.provaDaQueryString && $scope.provaDaQueryString.id == prova.id) {
                            onItemSelect($scope.provaDaQueryString, 'provas');
                        }
                        angular.forEach($scope.atleta.inscricao.provas, function(inscricaoProva) {
                            if (prova.id == inscricaoProva.id) {
                                $scope.atleta.provaSelecionada = 1;
                                $scope.campoProvaTocado = true;
                                prova.selecionado = true;
                                return false;
                            }
                        });
                    });
                    angular.forEach($scope.cursosDropdownList, function(curso) {
                        curso.selecionado = false;
                        angular.forEach($scope.atleta.inscricao.cursos, function(inscricaoCurso) {
                            if (curso.id == inscricaoCurso.id) {
                                $scope.atleta.cursoSelecionado = 1;
                                $scope.campoCursoTocado = true;
                                curso.selecionado = true;
                                return false;
                            }
                        });
                    });
                    $scope.defineUrlPagamentoCurso();
                };
                $scope.clicaNoItem = function(selecionada, item, tipo) {
                    if (selecionada) {
                        onItemSelect(item, tipo);
                    }
                    else {
                        $scope.removeItem(item.id, tipo);
                    }
                };
                $scope.reset = function(formInscricao, novoAtleta) {
                    $rootScope.atletaLogado = Autentic.token != 'undefined' && Autentic.token != null;
                    if (Autentic.userId) {
                        $scope.carregandoProvas = true;
                        $scope.limpaSelecaoProvas = false;
                        $scope.atleta = Atleta.get({'id': Autentic.userId, 'evento_slug': $scope.slug}, function() {
                            $scope.atleta.inscricao = new Inscricao($scope.atleta.inscricao);
                            $scope.atleta.idade = calculaIdadeAtleta($scope.atleta.nascimento);
                            $scope.defineUrlPagamentoCurso();
                        });
                    }
                    else {
                        $scope.atleta = new Atleta({
                            "nome": null,
                            "sobrenome": null,
                            "sexo": null,
                            "senha": null,
                            "confirmeSenha": null,
                            "nascimento": null,
                            "idade": null,
                            "cpf": null,
                            "email": null,
                            "telefone": null,
                            "celular": null,
                            "inscricao": new Inscricao({
                                "eventoId": $scope.evento.id,
                                "nomeTime": null,
                                "tipoAfiliacao": null,
                                "afiliacao": null,
                                "pedidoNumero": null,
                                "nomeConvidado": null,
                                "nomeSegundoConvidado": null,
                                "provas": [],
                                "cursos": []
                            }),
                            "provaSelecionada": null
                        });
                        limpaSelecaoProvas();
                        $scope.campoProvaTocado = false;
                        $scope.campoCursoTocado = false;
                        $scope.selecionaItens();
                        if (formInscricao) {
                            formInscricao.$setPristine();
                            formInscricao.$setUntouched();
                        }
                    }
                };
                $scope.reset();
                $scope.exibeLabelTipoAfiliacao = function(tipoAfiliacao) {
                    if (!tipoAfiliacao) {
                        return 'Escolha...';
                    }
                    var label = '';
                    angular.forEach($scope.tiposAfiliacoes, function(tipo) {
                        if (tipo.codigo == tipoAfiliacao) {
                            label = tipo.label;
                        }
                    });
                    return label;
                };
                $scope.selecionaTipoAfiliacao = function(tipoAfiliacao) {
                    $scope.atleta.inscricao.tipoAfiliacao = tipoAfiliacao.codigo;
                };
                $scope.defineSexo = function(valor) {
                    $scope.limpaSelecaoProvas = true;
                    $scope.atleta.sexo = valor;
                };
                $scope.$watch('atleta.email', function(novo, antigo) {
                    if ($scope.mensagemErro == 'Email já está cadastrado como atleta.') {
                        if (novo !== antigo) {
                            $scope.mensagemErro = '';
                        }
                    }
                });
                var filtraProvas = function() {
                    $scope.provasDropdownList = angular.copy($scope.provasParaSelecao);
                    if ($scope.atleta.sexo) {
                        $scope.provasDropdownList = $scope.provasDropdownList.filter(function(prova) {
                            var provaSexo = $filter('limitTo')(prova.sexo, 2).toUpperCase();
                            return provaSexo == $scope.atleta.sexo || provaSexo == 'AB' || provaSexo == 'MI';
                        });
                    }
                    if ($scope.atleta.nascimento) {
                        $scope.atleta.idade = calculaIdadeAtleta($scope.atleta.nascimento);
                        $scope.provasDropdownList = $scope.provasDropdownList.filter(function(prova) {
                            var limiteMinimo = prova.subCategoria.limiteMinimo || 0;
                            var limiteMaximo = prova.subCategoria.limiteMaximo || 100;
                            return $scope.atleta.idade >= limiteMinimo && $scope.atleta.idade <= limiteMaximo;
                        });
                    }
                    if ($scope.carregandoProvas) {
                        $scope.selecionaItens();
                    }
                    if ($scope.limpaSelecaoProvas) {
                        limpaSelecaoProvas();
                        $scope.selecionaItens();
                        $scope.limpaSelecaoProvas = false;
                    }
                };
                $scope.$watch('atleta.sexo', function(novo, antigo) {
                    if (novo) {
                        filtraProvas();
                    }
                });
                $scope.$watch('atleta.nascimento', function(novo, antigo) {
                    if (novo) {
                        $scope.limpaSelecaoProvas = !$scope.carregandoProvas;
                        filtraProvas();
                    }
                });
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
                    if (!campo) {
                        return false;
                    }
                    var valido = true;
                    if (campo.$name == 'email') {
                        valido = !campo.$error.email;
                    }
                    var statusCampo = (campo.$touched || campo.$dirty);
                    if (campo.$name == 'provas') {
                        statusCampo = $scope.campoProvaTocado || campo.$dirty;
                    }
                    if (campo.$name == 'cursos') {
                        statusCampo = $scope.campoCursoTocado || campo.$dirty;
                    }
                    return statusCampo && !campo.$error.required && valido;

                };
                $scope.campoEstaInvalido = function(campo) {
                    if (!campo) {
                        return false;
                    }
                    var temErro = $scope.verificaErro(campo);
                    if (campo.$name == 'email') {
                        temErro |= $scope.verificaErro(campo, 'email') || $scope.verificaErro(campo, 'emailNaoUsado');
                    }
                    if (campo.$name == 'senha') {
                        temErro |= $scope.verificaErro(campo, 'minlength');
                    }
                    if (_.includes(['cpf', 'celular', 'nascimento'], campo.$name)) {
                        temErro |= $scope.verificaErro(campo, 'mask');
                    }
                    if (campo.$name == 'nascimento') {
                        temErro |= $scope.verificaErro(campo, 'nascimentoCorreto');
                    }
                    if (campo.$name == 'cpf') {
                        temErro |= $scope.verificaErro(campo, 'cpfValido');
                    }
                    if (campo.$name == 'confirmeSenha') {
                        temErro |= $scope.verificaErro(campo, 'igualSenha');
                    }
                    if (campo.$name == 'provas') {
                        temErro = $scope.verificaErro(campo, null, $scope.campoProvaTocado);
                    }
                    if (campo.$name == 'cursos') {
                        temErro = $scope.verificaErro(campo, null, $scope.campoCursoTocado);
                    }
                    return temErro;
                };
                $scope.campoNaoTocado = function(campo) {
                    return !campo.$touched
                };
                $scope.enviandoInscricao = function(formInscricao) {
                    if (formInscricao.$invalid) {
                        formInscricao.$setPristine();
                        exibeValidacoes(formInscricao);
                        return false;
                    }
                    $scope.estaCarregando = true;
                    $scope.processaSucesso = function(resp) {
                        if (resp) {
                            Autentic.atualizaValores(resp.token, resp.userId);
                        }
                        $scope.reset();
                        $scope.estaCarregando = false;
                        $('#modalSucesso').modal('show');
                    };
                    $scope.processaFalha = function(response) {
                        $scope.mensagemErro = response.data['mensagemErro'];
                        exibeValidacoes(formInscricao);
                        $scope.estaCarregando = false;
                        $('#modalErro').modal('show');
                    };
                    if ($rootScope.atletaLogado) {
                        Inscricao.update(
                            {'id': $scope.atleta.id, 'inscricao_id': $scope.atleta.inscricao.id},
                            $scope.atleta.inscricao,
                            function() {
                                $scope.processaSucesso();
                            },
                            function(response) {
                                $scope.processaFalha(response);
                            }
                        );
                    }
                    else {
                        $scope.atleta.$save().then(
                            function(response) {
                                $scope.processaSucesso(response);
                            },
                            function(response) {
                                $scope.processaFalha(response);
                            }
                        );
                    }
                };
                $scope.redirecionaPagamento = function(modal, tipo) {
                    if (tipo == 'provas') {
                        $window.open($scope.urlPagamentoProvas, '_blank');
                    }
                    if (tipo == 'cursos') {
                        angular.forEach($scope.urlPagamentoCursos, function(url) {
                            $window.open(url, '_blank');
                        });
                    }
                    if (modal) {
                        $('#modalSucesso').modal('hide');
                    }
                };
            }
            if ($scope.itemMenu == 'horarios') {
                $scope.filtro = {
                    ditancia: null,
                    tipo: null,
                    sexo: null,
                    idade: null
                };
                $scope.filtraProvas = function(tipo, valor) {
                    if (tipo == 'D') {
                        $scope.filtro.distancia = valor;
                    }
                    if (tipo == 'T') {
                        $scope.filtro.tipo = valor;
                    }
                    if (tipo == 'S') {
                        $scope.filtro.sexo = valor;
                    }
                    if (tipo == 'I') {
                        $scope.filtro.idade = valor;
                    }
                    if (!tipo) {
                        $scope.filtro = {
                            ditancia: null,
                            tipo: null,
                            sexo: null,
                            idade: null
                        };
                    }
                    $scope.provasDropdownList = angular.copy($scope.provasParaSelecao);
                    if ($scope.filtro.distancia) {
                        $scope.provasDropdownList = $filter('filter')($scope.provasDropdownList, {distancia: $scope.filtro.distancia});
                    }
                    if ($scope.filtro.tipo) {
                        $scope.provasDropdownList = $filter('filter')($scope.provasDropdownList, {tipo: $scope.filtro.tipo});
                    }
                    if ($scope.filtro.sexo) {
                        $scope.provasDropdownList = $filter('filter')($scope.provasDropdownList, {sexo: $scope.filtro.sexo});
                    }
                    if ($scope.filtro.idade) {
                        $scope.provasDropdownList = $filter('filter')($scope.provasDropdownList, {'subCategoria': {'nome': $scope.filtro.idade}});
                    }
                    angular.forEach($scope.datas, function(data) {
                        data.provas = []
                    });
                    angular.forEach($scope.provasDropdownList, function(prova) {
                        angular.forEach($scope.datas, function(data) {
                            if (prova.dia.replace(/0/g, '') == data.data) {
                                data.provas.push(prova);
                            }
                        });
                    });
                }
            }
        });
    }]);
