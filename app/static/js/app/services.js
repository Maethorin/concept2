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
        return $resource('/api/atletas/:id/:evento_slug');
    })
    .factory('Inscricao', function($resource) {
        return $resource(
            '/api/atletas/:id/inscricoes/:inscricao_id',
            null,
            {'update': {method: 'PUT'}}
        );
    })
    .factory('Evento', function($resource) {
        return $resource('/api/eventos/:id');
    });
