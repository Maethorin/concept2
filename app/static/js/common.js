
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