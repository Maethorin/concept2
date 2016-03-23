
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

Date.prototype.idade = function() {
    var hoje = new Date();
    var idade = hoje.getFullYear() - this.getFullYear();
    if (hoje.getMonth() < this.getMonth() ||
        hoje.getMonth() == this.getMonth() && hoje.getDate() < this.getDate()) {
        idade--;
    }
    return idade;
};

function quebraData(nascimento, comoString) {
    nascimento = nascimento.split('');
    var ano = nascimento.splice(4, 4).join('');
    var mes = nascimento.splice(2, 2).join('');
    var dia = nascimento.splice(0, 2).join('');
    if (comoString) {
        return {ano: ano, mes: mes, dia: dia};
    }
    return {ano: parseInt(ano), mes: parseInt(mes) - 1, dia: parseInt(dia)};
}

function calculaIdadeAtleta(nascimento) {
    nascimento = quebraData(nascimento);
    return new Date(nascimento.ano, nascimento.mes, nascimento.dia).idade();
}

var urlBackEnd = '//concept2-staging.herokuapp.com';
if (window.location.hostname == 'localhost' && window.location.port == '5000') {
    urlBackEnd = 'http://localhost:5000';
}
if (window.location.hostname == '127.0.0.1') {
    urlBackEnd = 'http://localhost:5000';
}

var configApp = function($sceDelegateProvider, $httpProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        '{0}/**'.format([urlBackEnd])
    ]);
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.interceptors.push('atualizaToken');
};

var baseRun = function($rootScope, Autentic) {
    $rootScope.pagina = "";
    $rootScope.titulo = "";
    $rootScope.$on('$locationChangeSuccess', function(evt, absNewUrl, absOldUrl) {
        $rootScope.referrer = absOldUrl;
    });
    $rootScope.nomeCompleto = function(nome, sobrenome) {
        if (!nome) {
            nome = 'Nome'
        }
        if (!sobrenome) {
            sobrenome = 'Sobrenome'
        }
        return [nome, sobrenome].join(' ');
    };
    $rootScope.formataData = function(data) {
        if (!data) {
            return 'Sem Data';
        }
        return '{dia}/{mes}/{ano}'.format(quebraData(data, true));
    };
    $rootScope.formataCPF = function(cpf) {
        if (!cpf) {
            return 'Sem CPF';
        }
        cpf = cpf.split('');
        var dv = cpf.splice(9, 2).join('');
        var p3 = cpf.splice(6, 3).join('');
        var p2 = cpf.splice(3, 3).join('');
        return '{0}.{1}.{2}-{3}'.format([cpf.join(''), p2, p3, dv]);
    };
    $rootScope.calculaIdade = function(nascimento) {
        return calculaIdadeAtleta(nascimento);
    };
    $rootScope.formataTelefone = function(numero) {
        if (!numero) {
            return 'Sem número';
        }
        numero = numero.split('');
        var ddd = numero.splice(0, 2).join('');
        var parte1 = numero.splice(0, 4).join('');
        var parte2 = numero.join('');
        return '({0}) {1}-{2}'.format([ddd, parte1, parte2]);
    };
    Autentic.atualizaValores();
};

var atualizaTokenFactory = function(Autentic, $rootScope, $q, $window, ehAdmin) {
    var tokenHeader = ehAdmin ? 'xsrfu-token' : 'xsrf-token';
    var userHeader = ehAdmin ? 'useru-id' : 'user-id';
    var propriedadeLogado = ehAdmin ? 'adminLogado' : 'atletaLogado';
    return {
        response: function(response) {
            var headers = response.headers();
            if (headers[tokenHeader]) {

                Autentic.atualizaValores(headers[tokenHeader], headers[userHeader])
            }
            return response;
        },
        responseError: function(response) {
            if (response.status == 401) {
                Autentic.limpaValores();
                $rootScope[propriedadeLogado] = Autentic.estaLogado();
            }
            if (ehAdmin && $window.location.hash.indexOf('#/login') == -1) {
                $window.location = '{0}/#/login'.format([urlBackEnd]);
            }
            return $q.reject(response);
        },
        request: function(config) {
            config.headers[tokenHeader.toUpperCase()] = Autentic.token;
            return config;
        }
    };
};