describe('Página de eventos', function() {
    var $rootScope, $controller, $scope, $templateCache, $compile;
    urlBackEnd = 'url-backend-end';
    beforeEach(module('concept2', 'app-templates'));
    beforeEach(inject(function(_$rootScope_, _$controller_, _$templateCache_, _$compile_) {
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        $templateCache = _$templateCache_;
        $compile = _$compile_;
        $scope = $rootScope.$new();
    }));
    it('define valores no rootScope', function() {
        $controller('EventosController', { $scope: $scope, $rootScope: $rootScope });
        expect($rootScope.pagina).toBe('eventos');
        expect($rootScope.titulo).toBe('Eventos');
    });
    it('tem lista de eventos de resource', function() {
        var Evento = {
            query: function() {
                return [1, 2, 3]
            }
        };
        $controller('EventosController', { $scope: $scope, Evento: Evento });
        expect($scope.eventos).toEqual([1, 2, 3]);
    });
    it('trata html', function() {
        var $sce = {
            trustAsHtml: function(html) {
                return '#' + html + '#'
            }
        };
        $controller('EventosController', { $scope: $scope, $sce: $sce });
        expect($scope.trataHtml('zas')).toBe('#zas#');
    });
    it('tem html carregado', function() {
        var Evento = {
            query: function() {
                return [{
                    destaque: true,
                    titulo: 'Titulo Evento',
                    resumo: '<strong>contem <i>HTML</i></strong>',
                    slug: 'evento-url'
                }]
            }
        };
        var templateHtml = $templateCache.get('url-back-end/angular/eventos.html');
        $controller('EventosController', { $scope: $scope, Evento: Evento });
        var compilado = $compile(templateHtml)($scope);
        $scope.$digest();
        expect(compilado[0].outerHTML).toContain('<h3 class="ng-binding">Titulo Evento</h3>');
        expect(compilado[0].outerHTML).toContain('<a ng-href="/#/eventos/evento-url" href="/#/eventos/evento-url">Saiba mais...</a>');
    });
});