describe('Rotas de eventos', function() {
    var $route;
    beforeEach(module('concept2'));
    beforeEach(inject(function(_$route_) {
        $route = _$route_;
    }));
    it('tem rota para eventos', function() {
        expect($route.routes['/eventos']).toBeDefined();
    });
    it('rota para eventos esta configurada', function() {
        expect($route.routes['/eventos'].controller).toBe('EventosController');
        expect($route.routes['/eventos'].templateUrl).toBe('{0}/angular/eventos.html'.format([urlBackEnd]));
    });
    it('tem rota para evento', function() {
        expect($route.routes['/eventos/:slug']).toBeDefined();
    });
    it('rota para evento esta configurada', function() {
        expect($route.routes['/eventos/:slug'].controller).toBe('EventoController');
        expect($route.routes['/eventos/:slug'].templateUrl).toBe('{0}/angular/evento/evento.html'.format([urlBackEnd]));
    });
    it('tem rota para item de menu em evento', function() {
        expect($route.routes['/eventos/:slug/:itemMenu']).toBeDefined();
    });
    it('rota para item de menu em evento esta configurada', function() {
        expect($route.routes['/eventos/:slug/:itemMenu'].controller).toBe('EventoController');
        expect($route.routes['/eventos/:slug/:itemMenu'].templateUrl).toBe('{0}/angular/evento/evento.html'.format([urlBackEnd]));
    });
});