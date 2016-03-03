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

angular.module('concept2', [
    'ngRoute',
    'ngResource',
    'uiGmapgoogle-maps',
    'ui.mask',
    'angularjs-dropdown-multiselect',
    'concept2.services',
    'concept2.home',
    'concept2.produtos',
    'concept2.noticias',
    'concept2.comunidade',
    'concept2.eventos',
    'concept2.suporte',
    'concept2.contato'
]);
