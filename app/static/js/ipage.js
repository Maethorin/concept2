'use strict';


/**
 * Python-like string format function
 * @param {String} str - Template string.
 * @param {Object} data - Data to insert strings from.
 * @returns {String}
 */
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

/**
 * Python-like format method
 * @param {Object} data - Data to insert strings from.
 * @returns {String}
 */
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

var urlBackEnd = '//concept2-staging.herokuapp.com';
if (window.location.hostname == '127.0.0.1') {
    urlBackEnd = 'http://localhost:5000';
}

angular.module('concept2', [
    'ngRoute',
    'ngResource',
    'ngCookies',
    'uiGmapgoogle-maps',
    'ui.mask',
    'vcRecaptcha',
    'concept2.services',
    'concept2.login',
    'concept2.eventos'
])
    .factory('atualizaToken', ['Autentic', '$rootScope', '$q', function(Autentic, $rootScope, $q) {
        return {
            response: function(response) {
                var headers = response.headers();
                if (headers['xsrf-token']) {
                   Autentic.atualizaValores(headers['xsrf-token'], headers['user-id'])
                }
                return response;
            },
            responseError: function(response) {
                if (response.status == 401) {
                    Autentic.limpaValores();
                    $rootScope.atletaLogado = Autentic.estaLogado();
                }
                return $q.reject(response);
            },
            request: function(config) {
                config.headers['XSRF-TOKEN'] = Autentic.token;
                return config;
            }
        };
    }])
    .config(function($sceDelegateProvider, $routeProvider, $httpProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            '{0}/**'.format([urlBackEnd])
        ]);
        $routeProvider.when('/', {redirectTo: '/eventos/cabra-ri'});
        $httpProvider.defaults.withCredentials = true;
        $httpProvider.interceptors.push('atualizaToken');
    })
    .run(function ($rootScope, Autentic) {
        $rootScope.pagina = "";
        $rootScope.titulo = "";
        $rootScope.$on('$locationChangeSuccess', function(evt, absNewUrl, absOldUrl) {
            $rootScope.referrer = absOldUrl;
        });
        Autentic.atualizaValores();
        $rootScope.atletaLogado = Autentic.estaLogado();
    });
