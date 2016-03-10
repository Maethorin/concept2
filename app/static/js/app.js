'use strict';

var format = function(str, data) {
    var re = /{([^{}]+)}/g;

    return str.replace(/{([^{}]+)}/g, function(match, val) {
        var prop = data;
        val.split('.').forEach(function(key) {
            prop = prop[key];
        });

        return prop;
    });
};

String.prototype.format = function(data) {
    return format(this, data);
};

var nomesMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
var nomesDias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

Date.prototype.nomeMes = function() {
    return nomesMeses[this.getMonth()];
};

Date.prototype.nomeDia = function() {
    return nomesDias[this.getDay()];
};

Date.prototype.idadeNascidoEm = function(nascimento) {
    nascimento = [nascimento.splice(0, 2), nascimento.splice(2, 2), nascimento.splice(4, 4)];
    var dataNascimento = new Date(parseInt(nascimento.splice(4, 4)), parseInt(nascimento.splice(2, 2)) - 1, parseInt(nascimento.splice(0, 2)));
    var idade = (this - dataNascimento) / (1000 * 60 * 60 * 24 * 365.4);
    return nomesDias[this.getDay()];
};

var urlBackEnd = 'https://concept2-staging.herokuapp.com';
//var urlBackEnd = 'http://localhost:5000';

angular.module(
    'concept2',
    [
        'ngRoute',
        'ngResource',
        'ngCookies',
        'uiGmapgoogle-maps',
        'ui.mask',
        'concept2.services',
        'concept2.login',
        'concept2.home',
        'concept2.produtos',
        'concept2.noticias',
        'concept2.comunidade',
        'concept2.eventos',
        'concept2.suporte',
        'concept2.contato'
    ])
    .config(['$sceDelegateProvider', '$httpProvider', function($sceDelegateProvider, $httpProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            '{0}/**'.format([urlBackEnd])
        ]);
        $httpProvider.defaults.withCredentials = true;
    }])
    .run(['$rootScope', 'Autentic', function($rootScope, Autentic) {
        $rootScope.pagina = "";
        $rootScope.titulo = "";
        $rootScope.$on('$locationChangeSuccess', function(evt, absNewUrl, absOldUrl) {
            $rootScope.referrer = absOldUrl;
        });
        Autentic.atualizaValores();
        $rootScope.atletaLogado = Autentic.token != 'undefined' && Autentic.token != null;
    }]);
;'use strict';

angular.module('concept2.login', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
          .when('/atleta/login', {
            templateUrl: '{0}/angular/atleta/login.html'.format([urlBackEnd]),
            controller: 'LoginController'
          })
          .when('/atleta/logout', {
            templateUrl: '{0}/angular/home.html'.format([urlBackEnd]),
            controller: 'LogoutController'
          })
          .when('/atleta/perfil', {
            templateUrl: '{0}/angular/atleta/perfil.html'.format([urlBackEnd]),
            controller: 'PerfilController'
          })
          .when('/atleta/inscricoes', {
            templateUrl: '{0}/angular/atleta/inscricoes.html'.format([urlBackEnd]),
            controller: 'PerfilController'
          })
    }])
    .controller("LogoutController", ['$rootScope', '$scope', '$window', 'Login', 'Autentic', function($rootScope, $scope, $window, Login, Autentic) {
        Autentic.limpaValores();
        var login = new Login();
        login.$delete().then(
            function () {
                Autentic.atualizaValores();
                $rootScope.atletaLogado = false;
                if ($rootScope.referrer) {
                    $window.location = $rootScope.referrer;
                }
                else {
                    $window.location = '/';
                }
            }
        );
    }])
    .controller("LoginController", ['$rootScope', '$scope', '$window', 'Login', 'Autentic', function($rootScope, $scope, $window, Login, Autentic) {
        $rootScope.pagina = "atleta";
        $rootScope.titulo = "Atleta";
        $rootScope.atletaLogado = Autentic.token != 'undefined' && Autentic.token != null;
        $scope.login = new Login({
            'email': null,
            'senha': null
        });
        $scope.campoValido = function(campo) {
            if (campo) {
                return campo.$touched && campo.$valid
            }
            return true;
        };
        $scope.campoInvalido = function(campo) {
            if (campo) {
                return campo.$touched && campo.$invalid
            }
            return false;
        };
        $scope.loginFalhou = false;
        $scope.enviandoLogin = function() {
            if ($scope.formLogin.$valid) {
                $scope.login.$save().then(
                    function (response) {
                        console.log(response);
                        Autentic.atualizaValores();
                        $rootScope.atletaLogado = Autentic.token != 'undefined' && Autentic.token != null;
                        if ($rootScope.referrer) {
                            $window.location = $rootScope.referrer;
                        }
                    },
                    function () {
                        $scope.loginFalhou = true;
                    }
                );
            }
        };
    }]);
;'use strict';
angular.module('concept2.comunidade', [])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/comunidade', {
                templateUrl: '{0}/angular/comunidade.html'.format([urlBackEnd]),
                controller: 'ComunidadeController'
            })
    }])
    .config(['uiGmapGoogleMapApiProvider', function(uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyDzcLVVah4PjogAqerQdBcYowwzJcsKjv0',
            v: '3.20',
            language: 'pt-br',
            libraries: 'places'
        });
    }])
    .controller('ComunidadeController', ['$rootScope', '$scope', '$http', 'OndeRemar', function ($rootScope, $scope, $http, OndeRemar) {
        $rootScope.pagina = "comunidade";
        $rootScope.titulo = "Comunidade";
        $scope.modalidades = [
            {'nome': 'Clube de Remo', 'slug': 'clube-remo', 'ativo': true},
            {'nome': 'CrossFit', 'slug': 'crossfit', 'ativo': true},
            {'nome': 'Musculação', 'slug': 'musculacao', 'ativo': true},
            {'nome': 'Aula Coletiva', 'slug': 'aula-coletiva', 'ativo': true}
        ];
        $scope.map = { center: {latitude: -14.235004, longitude: -51.92528}, zoom: 4 };
        var adicionaIcone = function() {
            angular.forEach($scope.ondeRemar, function(local) {
                local.icone = '/static/img/comunidade/mini/{0}.png'.format([local.modalidade.codigo]);
                local.options = {
                    "title": local.modalidade.nome
                };
                local.exibeInfo = false;
            });
        };
        $scope.ondeRemar = OndeRemar.query(adicionaIcone);
        var events = {
            places_changed: function (searchBox) {
                var place = searchBox.getPlaces();
                if (place.length == 0) {
                    return false;
                }
                place = place[0];
                $scope.map.center = {'latitude': place.geometry.location.lat(), 'longitude': place.geometry.location.lng()};
                $scope.map.zoom = 14;
            }
        };
        $scope.searchbox = { template: '{0}/angular/comunidade/search-box.html'.format([urlBackEnd]), events:events};
        $scope.ponto = {};
        $scope.alternaTipo = function(modalidade) {
            modalidade.ativo = !modalidade.ativo;
            var modalidadesAtivas = [];
            angular.forEach($scope.modalidades, function(modalidade) {
                if (modalidade.ativo) {
                    modalidadesAtivas.push(modalidade.slug);
                }
            });
            if (modalidadesAtivas.length == 0) {
                $scope.ondeRemar = [];
            }
            else {
                $scope.ondeRemar = OndeRemar.query({'modalidade': modalidadesAtivas}, adicionaIcone);
            }
        };
    }]);
;'use strict';
angular.module('concept2.contato', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/contato', {
                templateUrl: '{0}/angular/contato.html'.format([urlBackEnd]),
                controller: 'ContatoController'
            })
    }])
    .controller('ContatoController', ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {
        $rootScope.pagina = "contato";
        $rootScope.titulo = "Contato"
    }]);
;'use strict';
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
    .controller('EventoController', ['$rootScope', '$scope', '$routeParams', '$http', '$sce', '$filter', '$window', '$location', 'Evento', 'Atleta', 'Inscricao', 'Autentic', function($rootScope, $scope, $routeParams, $http, $sce, $filter, $window, $location, Evento, Atleta, Inscricao, Autentic) {
        $scope.estaCarregando = false;
        $scope.slug = $routeParams.slug;
        $scope.itemMenu = $routeParams.itemMenu || 'sobre';
        $scope.template = '{0}/angular/evento/{1}.html'.format([urlBackEnd, $scope.itemMenu]);
        $scope.urlLojaInscricao = 'https://concept2.com.br/shop/index.php?route=product/product&product_id=125';
        $scope.maskDef = {'maskDefinitions': {'9': /\d/, 'D': /[0-3]/, 'd': /[0-9]/, 'M': /[0-1]/, 'm': /[0-2]/}};
        $rootScope.pagina = "eventos";
        $scope.exibeAjudaPedido = function() {
            $('#ajudaPedido').popover();
            $('#ajudaPedido').popover('toggle');
        };
        $scope.itensMenu = [
            {"slug": "sobre", "nome": "Sobre"},
            {"slug": "horarios", "nome": "Horários"},
            {"slug": "regulamento", "nome": "Regulamento"},
            {"slug": "resultados", "nome": "Resultados"},
            {"slug": "inscricao", "nome": "Inscreva-se"}
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
        $scope.evento = Evento.get({"id": $scope.slug}, function() {
            $rootScope.titulo = $scope.evento.titulo;
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
                    prova.selecionada = false;
                    $scope.provasDropdownList.push(prova);
                }
                var search = $location.search();
                if (search.hasOwnProperty('prova') && prova.codigo == search.prova) {
                    $scope.provaDaQueryString = prova;
                }
            });
            $scope.provasParaSelecao = angular.copy($scope.provasDropdownList);

            if ($scope.itemMenu == 'inscricao') {
                $scope.mensagemErro = '';
                $scope.tiposAfiliacoes = [
                    {'codigo': 'clube', 'label': 'Clube'},
                    {'codigo': 'academia', 'label': 'Academia'},
                    {'codigo': 'box-cf', 'label': 'Box de CF'},
                    {'codigo': 'independente', 'label': 'Independente'}
                ];
                $scope.campoProvaTocado = false;
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
                $scope.provasEventos = {
                    onItemSelect: function(prova) {
                        $scope.atleta.inscricao.provas.push({'id': prova.id});
                        $scope.atleta.provaSelecionada = 1;
                        $scope.campoProvaTocado = true;
                    },
                    onItemDeselect: function(prova) {
                        $scope.removeProva(prova.id);
                        if ($scope.atleta.inscricao.provas.length == 0) {
                            $scope.atleta.provaSelecionada = null;
                        }
                        $scope.campoProvaTocado = true;
                    }
                };
                var limpaSelecaoProvas = function() {
                    angular.forEach($scope.provasDropdownList, function(prova) {
                        prova.selecionada = false;
                    });
                    $scope.atleta.inscricao.provas = [];
                    $scope.atleta.provaSelecionada = null;
                };
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
                    angular.forEach($scope.atleta.inscricao.provas, function(prova, index) {
                        if (prova.id == provaId) {
                            $scope.atleta.inscricao.provas.splice(index, 1);
                            return false;
                        }
                    });
                    angular.forEach($scope.provasDropdownList, function(prova) {
                        if (prova.id == provaId) {
                            prova.selecionada = false;
                            return false;
                        }
                    });
                    if ($scope.atleta.inscricao.provas.length == 0) {
                        $scope.atleta.provaSelecionada = null;
                    }
                    $scope.campoProvaTocado = true;
                    $scope.provaDaQueryString = null;
                };
                $scope.selecionaProvas = function() {
                    angular.forEach($scope.provasDropdownList, function(prova) {
                        prova.selecionada = false;
                        if ($scope.provaDaQueryString && $scope.provaDaQueryString.id == prova.id) {
                            $scope.provasEventos.onItemSelect($scope.provaDaQueryString);
                        }
                        angular.forEach($scope.atleta.inscricao.provas, function(inscricaoProva) {
                            if (prova.id == inscricaoProva.id) {
                                $scope.atleta.provaSelecionada = 1;
                                $scope.campoProvaTocado = true;
                                prova.selecionada = true;
                                return false;
                            }
                        });
                    });
                };
                $scope.clicaNaProva = function(selecionada, prova) {
                    if (selecionada) {
                        $scope.provasEventos.onItemSelect(prova);
                    }
                    else {
                        $scope.provasEventos.onItemDeselect(prova);
                    }
                };
                $scope.reset = function(formInscricao, novoAtleta) {
                    $rootScope.atletaLogado = Autentic.token != 'undefined' && Autentic.token != null;
                    if (Autentic.userId) {
                        $scope.carregandoProvas = true;
                        $scope.limpaSelecaoProvas = false;
                        $scope.atleta = Atleta.get({'id': Autentic.userId, 'evento_slug': $scope.slug}, function() {
                            $scope.atleta.inscricao = new Inscricao($scope.atleta.inscricao);
                        });
                    }
                    else {
                        $scope.atleta = new Atleta({
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
                            "inscricao": new Inscricao({
                                "nomeTime": null,
                                "tipoAfiliacao": null,
                                "afiliacao": null,
                                "pedidoNumero": null,
                                "provas": []
                            }),
                            "provaSelecionada": null
                        });
                        limpaSelecaoProvas();
                        $scope.campoProvaTocado = false;
                        $scope.selecionaProvas();
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
                $scope.$watch('atleta.sexo', function(novo, antigo) {
                    if (novo) {
                        $scope.provasDropdownList = $filter('filter')(
                            $scope.provasParaSelecao,
                            {sexo: novo},
                            function(atual, esperado) {
                                atual = $filter('limitTo')(atual, 2).toUpperCase();
                                return atual == esperado || atual == 'AB' || atual == 'MI';
                            }
                        );
                        if ($scope.carregandoProvas) {
                            $scope.selecionaProvas();
                            $scope.carregandoProvas = false;
                        }
                        if ($scope.limpaSelecaoProvas) {
                            limpaSelecaoProvas();
                            $scope.selecionaProvas();
                            $scope.limpaSelecaoProvas = false;
                        }
                    }
                });
                $scope.$watch('atleta.nascimento', function(novo, antigo) {
                    if (novo) {
                        $scope.provasDropdownList = $filter('filter')(
                            $scope.provasParaSelecao,
                            {sexo: novo},
                            function(atual, esperado) {
                                atual = $filter('limitTo')(atual, 2).toUpperCase();
                                return atual == esperado || atual == 'AB' || atual == 'MI';
                            }
                        );
                        if ($scope.carregandoProvas) {
                            $scope.selecionaProvas();
                            $scope.carregandoProvas = false;
                        }
                        if ($scope.limpaSelecaoProvas) {
                            limpaSelecaoProvas();
                            $scope.selecionaProvas();
                            $scope.limpaSelecaoProvas = false;
                        }
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
                    $scope.processaSucesso = function() {
                        Autentic.atualizaValores();
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
                        Inscricao.update({'id': $scope.atleta.id, 'inscricao_id': $scope.atleta.inscricao.id}, $scope.atleta.inscricao)
                            .then(
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
                            function() {
                                $scope.processaSucesso();
                            },
                            function(response) {
                                $scope.processaFalha(response);
                            }
                        );
                    }
                };
                $scope.redirecionaPagamento = function(modal) {
                    $window.open($scope.urlLojaInscricao, '_blank');
                    if (modal) {
                        $('#modalSucesso').modal('hide');
                    }
                };
            }
        });
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
    }]);
;'use strict';

angular.module('concept2.home', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
          .when('/', {
            templateUrl: '{0}/angular/home.html'.format([urlBackEnd]),
            controller: 'HomeController'
          })
    }])
    .controller("HomeController", ['$rootScope', 'Autentic', function($rootScope, Autentic) {
        $rootScope.pagina = "home";
        $rootScope.titulo = "Inicial";
        $rootScope.atletaLogado = Autentic.token != 'undefined' && Autentic.token != null;
    }]);
;'use strict';
angular.module('concept2.noticias', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/noticias', {
                templateUrl: '{0}/angular/noticias.html'.format([urlBackEnd]),
                controller: 'NoticiasController'
            })
    }])
    .controller('NoticiasController', ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {
        $rootScope.pagina = "noticias";
        $rootScope.titulo = "Noticias";
        $scope.noticias = [];
        $http.get('/json/noticias.json').then(function(response) {
            $scope.noticias = response.data;
        });
    }]);
;'use strict';
angular.module('concept2.produtos', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/produtos', {
                templateUrl: '{0}/angular/produtos.html'.format([urlBackEnd]),
                controller: 'ProdutosController'
            })
            .when('/produtos/:slug', {
                templateUrl: '{0}/angular/produtos/modelod.html'.format([urlBackEnd]),
                controller: 'ModeloController'
            })
            .when('/produtos/:slug/:modeloMenu', {
                templateUrl: '{0}/angular/produtos/modelod.html'.format([urlBackEnd]),
                controller: 'ModeloController'
            })
    }])
    .controller('ProdutosController', ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {
        $rootScope.pagina = "produtos";
        $rootScope.titulo = "Produtos"
    }])
    .controller('ModeloController', ['$routeParams', '$rootScope', '$scope', '$sce', function($routeParams, $rootScope, $scope, $sce) {
        $scope.slug = $routeParams.slug;
        $scope.modeloMenu = $routeParams.modeloMenu || 'sobre';
        $scope.template = '{0}/angular/produtos/{1}.html'.format([urlBackEnd, $scope.modeloMenu]);
        $rootScope.pagina = "produtos";
        $scope.modelosMenu = [
            {"slug": "sobre", "nome": "Sobre"},
            {"slug": "caracteristicas", "nome": "Características"},
            {"slug": "especificacoes", "nome": "Especificações"}
        ];
        $scope.trataHtml = function(html) {
            return $sce.trustAsHtml(html);
        };
    }]);;'use strict';
angular.module('concept2.services', [])
    .service('Autentic', ['$cookies', function($cookies) {
        this.token = $cookies.get('XSRF-TOKEN');
        this.userId = $cookies.get('USER_ID');
        this.atualizaValores = function() {
            this.token = $cookies.get('XSRF-TOKEN');
            this.userId = $cookies.get('USER_ID');
        };
        this.limpaValores = function() {
            $cookies.remove('XSRF-TOKEN');
            $cookies.remove('USER_ID');
        };
    }])
    .factory('OndeRemar', ['$resource', function($resource) {
        return $resource('{0}/api/onde-remar/:id'.format([urlBackEnd]));
    }])
    .factory('Atleta', ['$resource', function($resource) {
        return $resource('{0}/api/atletas/:id/:evento_slug'.format([urlBackEnd]));
    }])
    .factory('Login', ['$resource', function($resource) {
        return $resource('{0}/api/login'.format([urlBackEnd]));
    }])
    .factory('Inscricao', ['$resource', function($resource) {
        return $resource(
            '{0}/api/atletas/:id/inscricoes/:inscricao_id'.format([urlBackEnd]),
            null,
            {'update': {method: 'PUT'}}
        );
    }])
    .factory('Evento', ['$resource', function($resource) {
        return $resource('{0}/api/eventos/:id'.format([urlBackEnd]));
    }]);
;
'use strict';
angular.module('concept2.suporte', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
          .when('/suporte', {
            templateUrl: '{0}/angular/suporte.html'.format([urlBackEnd]),
            controller: 'SuporteController'
          })
    }])
 .controller('SuporteController', ['$rootScope','$scope', '$http', function($rootScope, $scope, $http) {
     $rootScope.pagina = "suporte";
        $rootScope.titulo = "Suporte"
    }]);
