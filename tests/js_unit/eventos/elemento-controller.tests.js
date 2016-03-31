describe('Página do evento', function() {
    var $compile, $rootScope, $controller, $scope, $templateCache, $routeParams, $httpBackend, $location;
    beforeEach(module('concept2', 'app-templates'));
    beforeEach(inject(function(_$compile_, _$rootScope_, _$controller_, _$templateCache_, _$httpBackend_, _$location_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        $templateCache = _$templateCache_;
        $httpBackend = _$httpBackend_;
        $location = _$location_;
        $routeParams = {
            slug: 'evento-url'
        };
        var $sce = {
            trustAsHtml: function(html) {
                return '#' + html + '#'
            }
        };
        $scope = $rootScope.$new();
        $location.search = function() {
            return {
                prova: 'CODIGO'
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
        expect($scope.atleta.atletas).toEqual([]);
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
        var evento;
        beforeEach(function() {
            evento = {
                id: 1,
                titulo: 'Titulo Evento',
                provas: [],
                cursos: [],
                dataInicio: {dia: 12, mes: 3, ano: 2016},
                dataFim: {dia: 14, mes: 3, ano: 2016}
            }
        });
        it('atualiza scope', function() {
            $httpBackend.expect('GET', '{0}/api/eventos/evento-url'.format([urlBackEnd])).respond(evento);
            $httpBackend.flush();
            expect($scope.evento.titulo).toBe('Titulo Evento');
        });
        it('preenche datas com um dia', function() {
            evento.dataFim.dia = 12;
            $httpBackend.expect('GET', '{0}/api/eventos/evento-url'.format([urlBackEnd])).respond(evento);
            $httpBackend.flush();
            expect($scope.datas).toEqual([{data: '12/03', dia: 'Sábado, 12 de Março', provas: []}]);
            expect($scope.evento.duracao).toBe('dia 12 de Março');
        });
        it('preenche datas com mais de um dia', function() {
            $httpBackend.expect('GET', '{0}/api/eventos/evento-url'.format([urlBackEnd])).respond(evento);
            $httpBackend.flush();
            expect($scope.datas).toEqual([
                {data: '12/03', dia: 'Sábado, 12 de Março', provas: []},
                {data: '13/03', dia: 'Domingo, 13 de Março', provas: []},
                {data: '14/03', dia: 'Segunda, 14 de Março', provas: []}
            ]);
            expect($scope.evento.duracao).toBe('de 12 a 14 de Março');
        });
        it('preenche datas com dia 1 no fim', function() {
            evento.dataInicio = {dia: 31, mes: 3, ano: 2016};
            evento.dataFim = {dia: 1, mes: 4, ano: 2016};
            $httpBackend.expect('GET', '{0}/api/eventos/evento-url'.format([urlBackEnd])).respond(evento);
            $httpBackend.flush();
            expect($scope.datas).toEqual([
                {data: '31/03', dia: 'Quinta, 31 de Março', provas: []},
                {data: '01/04', dia: 'Sexta, 1º de Abril', provas: []}
            ]);
            expect($scope.evento.duracao).toBe('de 31 de Março a 1º de Abril');
        });
        it('preenche datas com dia 1 na frente', function() {
            evento.dataInicio = {dia: 1, mes: 3, ano: 2016};
            evento.dataFim = {dia: 2, mes: 3, ano: 2016};
            $httpBackend.expect('GET', '{0}/api/eventos/evento-url'.format([urlBackEnd])).respond(evento);
            $httpBackend.flush();
            expect($scope.datas).toEqual([
                {data: '01/03', dia: 'Terça, 1º de Março', provas: []},
                {data: '02/03', dia: 'Quarta, 2 de Março', provas: []}
            ]);
            expect($scope.evento.duracao).toBe('de 1º a 2 de Março');
        });
        it('preenche provas para o dia', function() {
            evento.provas = [
                {id: 1, dia: '12/03'},
                {id: 2, dia: '12/03'},
                {id: 3, dia: '13/03'},
                {id: 4, dia: '14/03'},
                {id: 5, dia: '13/03'}
            ];
            $httpBackend.expect('GET', '{0}/api/eventos/evento-url'.format([urlBackEnd])).respond(evento);
            $httpBackend.flush();
            expect($scope.datas).toEqual([
                {data: '12/03', dia: 'Sábado, 12 de Março', provas: [
                    {id: 1, dia: '12/03'},
                    {id: 2, dia: '12/03'}
                ]},
                {data: '13/03', dia: 'Domingo, 13 de Março', provas: [
                    {id: 3, dia: '13/03'},
                    {id: 5, dia: '13/03'}
                ]},
                {data: '14/03', dia: 'Segunda, 14 de Março', provas: [{id: 4, dia: '14/03'}]}
            ]);
        });
        it('preenche provas para a tabela', function() {
            evento.provas = [
                {id: 1, dia: '12/03', distancia: 500},
                {id: 2, dia: '12/03', distancia: 0},
                {id: 3, dia: '13/03', distancia: 500},
                {id: 4, dia: '14/03', distancia: 0},
                {id: 5, dia: '13/03', distancia: 500}
            ];
            $httpBackend.expect('GET', '{0}/api/eventos/evento-url'.format([urlBackEnd])).respond(evento);
            $httpBackend.flush();
            expect($scope.provasDropdownList).toEqual([
                {id: 1, dia: '12/03', distancia: 500, selecionado: false},
                {id: 3, dia: '13/03', distancia: 500, selecionado: false},
                {id: 5, dia: '13/03', distancia: 500, selecionado: false}
            ]);
            expect($scope.provasParaSelecao).toEqual($scope.provasDropdownList);
        });
        it('define prova da querystring', function() {
            evento.provas = [
                {id: 1, dia: '12/03', codigo: 'CODIGO'}
            ];
            $httpBackend.expect('GET', '{0}/api/eventos/evento-url'.format([urlBackEnd])).respond(evento);
            $httpBackend.flush();
            expect($scope.provaDaQueryString).toEqual({id: 1, dia: '12/03', codigo: 'CODIGO'});
        });
        it('preenche cursos para a tabela', function() {
            evento.cursos = [
                {id: 1, dia: '12/03'},
                {id: 3, dia: '13/03'},
                {id: 5, dia: '13/03'}
            ];
            $httpBackend.expect('GET', '{0}/api/eventos/evento-url'.format([urlBackEnd])).respond(evento);
            $httpBackend.flush();
            expect($scope.cursosDropdownList).toEqual([
                {id: 1, dia: '12/03', selecionado: false},
                {id: 3, dia: '13/03', selecionado: false},
                {id: 5, dia: '13/03', selecionado: false}
            ]);
        });
    });
});