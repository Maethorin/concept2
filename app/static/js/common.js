
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

