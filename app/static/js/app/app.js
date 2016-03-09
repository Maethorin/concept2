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

var urlBackEnd = 'https://concept2-staging.herokuapp.com';  //concetp2-staging.herokuapp.com

angular.module('concept2', [
    'ngRoute',
    'ngResource',
    'ngCookies',
    'uiGmapgoogle-maps',
    'ui.mask',
    'angularjs-dropdown-multiselect',
    'concept2.services',
    'concept2.login',
    //'concept2.home',
    //'concept2.produtos',
    //'concept2.noticias',
    //'concept2.comunidade',
    'concept2.eventos',
    //'concept2.suporte',
    //'concept2.contato'
])
    .config(function($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            '{0}/**'.format([urlBackEnd])
        ])
    })
    .run(function ($rootScope, Autentic) {
        $rootScope.pagina = "";
        $rootScope.titulo = "";
        $rootScope.$on('$locationChangeSuccess', function(evt, absNewUrl, absOldUrl) {
            $rootScope.referrer = absOldUrl;
        });
        Autentic.atualizaValores();
        $rootScope.atletaLogado = Autentic.token != 'undefined' && Autentic.token != null;
    });
