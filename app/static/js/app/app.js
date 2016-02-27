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

angular.module('concept', [
    'ngRoute',
    'ui.mask',
    'concept.home',
    'concept.produtos',
    'concept.noticias',
    'concept.comunidade',
    'concept.eventos',
    'concept.suporte',
    'concept.contato'
]);
