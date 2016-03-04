angular.module('concept2.services', [])
    .factory('Autentic', function($cookies) {
        return {
            token: $cookies.get('XSRF-TOKEN'),
            user_id: $cookies.get('USER_ID')
        }
    })
    .factory('OndeRemar', function($resource) {
        return $resource('/api/onde-remar/:id');
    })
    .factory('Atleta', function($resource) {
        return $resource('/api/atletas/:id');
    })
    .factory('Evento', function($resource) {
        return $resource('/api/eventos/:id');
    });
