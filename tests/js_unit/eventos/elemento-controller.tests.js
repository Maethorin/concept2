describe('Página do evento', function() {
    var $compile, $rootScope, $controller, $scope, $templateCache, $routeParams;
    beforeEach(module('concept2', 'app-templates'));
    beforeEach(inject(function(_$compile_, _$rootScope_, _$controller_, _$templateCache_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        $templateCache = _$templateCache_;
        $scope = $rootScope.$new();
        $routeParams = {
            slug: 'evento-url'
        };
        var $sce = {
            trustAsHtml: function(html) {
                return '#' + html + '#'
            }
        };
        $controller('EventoController', { $scope: $scope, $rootScope: $rootScope, $sce: $sce, $routeParams: $routeParams });
    }));
    it('define valores no $rootScope', function() {
        expect($rootScope.pagina).toBe('eventos');
        expect($rootScope.titulo).toBe('Eventos');
    });
    it('define valores gerais no $scope', function() {
        expect($scope.estaCarregando).toBeFalsy();
        expect($scope.slug).toBe($routeParams.slug);
        expect($scope.itemMenu).toBe('sobre');
        expect($scope.template).toBe('{0}/angular/evento/{1}.html'.format([urlBackEnd, $scope.itemMenu]));
        expect($scope.itensMenu).toEqual([
            {"slug": "sobre", "nome": "Sobre"},
            {"slug": "horarios", "nome": "Horários"},
            {"slug": "regulamento", "nome": "Regulamento"},
            {"slug": "provas", "nome": "Provas"},
            {"slug": "cursos", "nome": "Cursos"},
            {"slug": "resultados", "nome": "Resultados"}
        ]);
        expect($scope.colocacoes).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    });
    it('define valores de provas e cursos no $scope', function() {
        expect($scope.atleta).toBeDefined();
        expect($scope.maskDef).toEqual({'maskDefinitions': {'9': /\d/, 'D': /[0-3]/, 'd': /[0-9]/, 'M': /[0-1]/, 'm': /[0-2]/}});
        expect($scope.temProvas).toBeTruthy();
        expect($scope.temCursos).toBeTruthy();
        expect($scope.exibeProvas).toBeTruthy();
        expect($scope.exibeCursos).toBeTruthy();
        expect($scope.campoProvaTocado).toBeFalsy();
        expect($scope.datas).toEqual([]);
        expect($scope.provasDropdownList).toEqual([]);
        expect($scope.provaDaQueryString).toBeDefined();
        expect($scope.cursosDropdownList).toEqual([]);
        expect($scope.provasParaSelecao).toEqual([]);
        expect($scope.mensagemErro).toBeDefined();
        expect($scope.urlPagamentoProvas).toBeDefined();
        expect($scope.urlPagamentoCursos).toEqual([]);
        expect($scope.cadastroEmLote).toBeFalsy();
        expect($scope.atletasEmLote).toEqual([]);
        expect($scope.atletasEmLoteComErro).toEqual([]);
        expect($scope.atletasEmLoteValido).toBeDefined();
        expect($scope.urlArquivoEmLote).toBe('{0}/angular/inscricao-lote.csv'.format([urlBackEnd]));
        expect($scope.tiposAfiliacoes).toEqual([
            {'codigo': 'clube', 'label': 'Clube'},
            {'codigo': 'academia', 'label': 'Academia'},
            {'codigo': 'box-cf', 'label': 'Box de CF'},
            {'codigo': 'independente', 'label': 'Independente'}
        ]);
        expect($scope.campoProvaTocado).toBeFalsy();
        expect($scope.campoCursoTocado).toBeFalsy();
        expect($scope.carregandoProvas).toBeFalsy();
    });
    it('define valores de horarios no $scope', function() {
        expect($scope.filtro).toEqual({
            ditancia: null,
            tipo: null,
            sexo: null,
            idade: null
        });
    });
    it('trata html', function() {
        expect($scope.trataHtml('zas')).toBe('#zas#');
    });
    it('formata duração de curso', function() {
        expect($scope.formataDuracao(320)).toBe('5h20min');
    });
    it('formata valor de curso', function() {
        expect($scope.formataValor(45221)).toBe('R$ 452,21');
    });
    it('seleciona item de prova', function() {
        var chamou = false;
        $scope.defineUrlPagamentoCurso = function() {
            chamou = true;
        };
        $scope.atleta = {
            inscricao: {
                provas: []
            },
            provaSelecionada: null
        };
        $scope.selecionandoItem({id: 1}, 'provas');
        expect($scope.atleta.inscricao.provas).toEqual([{'id': 1}]);
        expect($scope.atleta.provaSelecionada).toBe(1);
        expect($scope.campoProvaTocado).toBeTruthy();
        expect(chamou).toBeFalsy();
    });
    it('seleciona item de curso', function() {
        var chamou = false;
        $scope.defineUrlPagamentoCurso = function() {
            chamou = true;
        };
        $scope.atleta = {
            inscricao: {
                cursos: []
            },
            cursoSelecionado: null
        };
        $scope.selecionandoItem({id: 1}, 'cursos');
        expect($scope.atleta.inscricao.cursos).toEqual([{'id': 1}]);
        expect($scope.atleta.cursoSelecionado).toBe(1);
        expect($scope.campoCursoTocado).toBeTruthy();
        expect(chamou).toBeTruthy();
    });
    describe('carregando evento', function() {

    });
});