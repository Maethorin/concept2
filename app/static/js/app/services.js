angular.module('concept2.services', [])
    .factory('OndeRemar', function($resource) {
        return $resource('/api/onde-remar/:id');
    })
    .factory('Evento', function($resource) {
        return $resource('/api/eventos/:id');
    });
