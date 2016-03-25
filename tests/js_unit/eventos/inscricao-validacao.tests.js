describe('Diretivas de validação de Inscrição', function() {
    var $compile, $rootScope;
    beforeEach(module('concept2'));
    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    describe('validando e-mail com email-nao-usado', function() {
        beforeEach(function() {
            $rootScope.atleta = {email: ''};
            $compile('<form name="form"><input type="email" class="form-control" name="email" id="email" ng-model="atleta.email" aria-describedby="helpEmail" required email-nao-usado /></form>')($rootScope);
            $rootScope.$digest();
        });
        it('adiciona validador', function() {
            expect($rootScope.form.email.$validators.emailNaoUsado).toBeDefined();
        });
        it('retorna true se mensagemErro for diferente de Email já está cadastrado como atleta.', function() {
            $rootScope.mensagemErro = 'Outra coisa';
            expect($rootScope.form.email.$validators.emailNaoUsado()).toBeTruthy();
        });
        it('retorna false se mensagemErro for Email já está cadastrado como atleta.', function() {
            $rootScope.mensagemErro = 'Email já está cadastrado como atleta.';
            expect($rootScope.form.email.$validators.emailNaoUsado()).toBeFalsy();
        });
    });

    describe('validando cpf', function() {
        beforeEach(function() {
            $rootScope.atleta = {cpf: ''};
            $compile('<form name="form"><input type="text" class="form-control" id="cpf" name="cpf" ng-model="atleta.cpf" aria-describedby="helpCpf" ui-mask="999.999.999-99" required cpf-valido/></form>')($rootScope);
            $rootScope.$digest();
        });
        describe('com cpf-valido', function() {
            it('adiciona validador', function() {
                expect($rootScope.form.cpf.$validators.cpfValido).toBeDefined();
            });
            it('valida se cpf é passado na função.', function() {
                expect($rootScope.form.cpf.$validators.cpfValido(null, '19119119100')).toBeTruthy();
            });
            it('valida se cpf tem não números.', function() {
                expect($rootScope.form.cpf.$validators.cpfValido(null, '191.191.191-00')).toBeTruthy();
            });
            it('retorna true se cpf é válido.', function() {
                $rootScope.form.cpf.$setViewValue('01874429758');
                expect($rootScope.form.cpf.$validators.cpfValido()).toBeTruthy();
            });
            it('retorna false se cpf é inválido.', function() {
                $rootScope.form.cpf.$setViewValue('11155522211');
                expect($rootScope.form.cpf.$validators.cpfValido()).toBeFalsy();
            });
        });
        describe('com ng-mask', function() {
            it('formata corretamente', function() {
                $rootScope.form.cpf.$setViewValue('19119119100');
                expect($rootScope.form.cpf.$viewValue).toBe('191.191.191-00');
            });
        });
    });

    describe('validando confirmacao com igual-senha', function() {
        beforeEach(function() {
            $rootScope.atleta = {confirmeSenha: '', senha: '111111'};
            $compile('<form name="form"><input type="password" class="form-control" name="confirmeSenha" id="confirmeSenha" ng-model="atleta.confirmeSenha" aria-describedby="helpConfirmeSenha" required igual-senha/></form>')($rootScope);
            $rootScope.$digest();
        });
        it('adiciona validador', function() {
            expect($rootScope.form.confirmeSenha.$validators.igualSenha).toBeDefined();
        });
        it('retorna true se são iguais definindo no campo', function() {
            $rootScope.form.confirmeSenha.$setViewValue('111111');
            expect($rootScope.form.confirmeSenha.$validators.igualSenha()).toBeTruthy();
        });
        it('retorna true se são iguais passando na função', function() {
            expect($rootScope.form.confirmeSenha.$validators.igualSenha(null, '111111')).toBeTruthy();
        });
        it('retorna false se são diferentes.', function() {
            $rootScope.form.confirmeSenha.$setViewValue('222222');
            expect($rootScope.form.confirmeSenha.$validators.igualSenha()).toBeFalsy();
        });
    });

    describe('validando nascimento', function() {
        var hoje = new Date();
        var anoHoje = hoje.getFullYear();
        var dataMinima = '{0}/{1}/{2}'.format([hoje.getDate().paddingLeft(2), (hoje.getMonth() + 1).paddingLeft(2), anoHoje - 100]);
        var dataMaxima = '{0}/{1}/{2}'.format([hoje.getDate().paddingLeft(2), (hoje.getMonth() + 1).paddingLeft(2), anoHoje - 9]);
        beforeEach(function() {
            $rootScope.atleta = {nascimento: null};
            $rootScope.maskDef = {'maskDefinitions': {'9': /\d/, 'D': /[0-3]/, 'd': /[0-9]/, 'M': /[0-1]/, 'm': /[0-2]/}};
            $compile('<form name="form"><input data-format="dd/MM/yyyy" data-type="" class="form-control" name="nascimento" id="nascimento" ui-mask="D9/M9/9999" ng-model="atleta.nascimento" aria-describedby="helpData" required nascimento-correto ui-options="maskDef"/></form>')($rootScope);
            $rootScope.$digest();
        });
        describe('com ng-mask', function() {
            it('formata corretamente', function() {
                $rootScope.form.nascimento.$setViewValue('12121991');
                expect($rootScope.form.nascimento.$viewValue).toBe('12/12/1991');
            });
        });
        describe('com nascimento-correto', function() {
            it('adiciona validador', function() {
                expect($rootScope.form.nascimento.$validators.nascimentoCorreto).toBeDefined();
            });
            it('retorna true se data é correta definindo no campo', function() {
                $rootScope.form.nascimento.$setViewValue('12121991');
                expect($rootScope.form.nascimento.$validators.nascimentoCorreto()).toBeTruthy();
            });
            it('retorna true se data é correta passando na função', function() {
                expect($rootScope.form.nascimento.$validators.nascimentoCorreto(null, '12/12/1991')).toBeTruthy();
            });
            it('retorna false se idade é maior que 100 anos', function() {
                expect($rootScope.form.nascimento.$validators.nascimentoCorreto(null, '12/12/1900')).toBeFalsy();
            });
            it('retorna false se idade é menor que 9 anos', function() {
                expect($rootScope.form.nascimento.$validators.nascimentoCorreto(null, '12/12/2012')).toBeFalsy();
            });
            it('retorna true se idade é 100 anos', function() {
                expect($rootScope.form.nascimento.$validators.nascimentoCorreto(null, dataMinima)).toBeTruthy();
            });
            it('retorna true se idade é 9 anos', function() {
                expect($rootScope.form.nascimento.$validators.nascimentoCorreto(null, dataMaxima)).toBeTruthy();
            });
            it('retorna false se gera erro', function() {
                expect($rootScope.form.nascimento.$validators.nascimentoCorreto(null, '12/asd/4')).toBeFalsy();
            });
        });
    });

});
