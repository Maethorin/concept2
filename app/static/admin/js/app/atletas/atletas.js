'use strict';

angular.module('concept2Admin.atletas', ['ngRoute'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/atletas', {
        templateUrl: '{0}/angular/crud/atleta/lista.html'.format([urlBackEnd]),
        controller: 'AtletasController'
      })
      .when('/atletas/:id', {
        templateUrl: '{0}/angular/crud/atleta/elemento.html'.format([urlBackEnd]),
        controller: 'AtletaController'
      });
  }])
  .controller("AtletasController", ['$rootScope', '$scope', 'Atleta', 'SweetAlert', function($rootScope, $scope, Atleta, SweetAlert) {
    $rootScope.pagina = "atletas";
    $rootScope.titulo = "Atletas";
    $scope.lista = Atleta.query();
    $scope.buscaAtleta = '';
    $scope.removeAtleta = function(atleta, indice) {
      SweetAlert.swal({
          title: "Tem certeza?",
          text: "Deseja remover o Atleta {0}!".format([atleta.nomeCompleto]),
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Sim, remova!",
          cancelButtonText: "Nope",
          closeOnConfirm: false
        },
        function(isConfirm) {
          if (isConfirm) {
            Atleta.remove(
              {id: atleta.id},
              function(response) {
                $scope.lista.splice(indice, 1);
                SweetAlert.swal('Sucesso', 'Atleta removido com sucesso!', 'success');
              }
            );
          }
        }
      );
    }
  }])
  .controller("AtletaController", ['$rootScope', '$routeParams', '$scope', '$location', 'Atleta', 'SweetAlert', function($rootScope, $routeParams, $scope, $location, Atleta, SweetAlert) {
    $scope.id = $routeParams.id;
    $rootScope.pagina = "atleta";
    $rootScope.titulo = "Atleta";
    $scope.masculinoSelecionado = true;
    var criando = $scope.id == 'new';
    if (criando) {
      $scope.atleta = {
        nome: null,
        sobrenome: null,
        email: null,
        cpf: null,
        dataNascimento: null,
        celular: null,
        telefone: null,
        sexo: "MA",
        tecnico: null
      };
    }
    else {
      Atleta.get({id: $scope.id}, function(atleta) {
        $scope.atleta = atleta;
        $scope.atleta.dataNascimento = new Date($scope.atleta.dataNascimento);
        $scope.masculinoSelecionado = $scope.atleta.sexo == 'MA';
        console.log($scope.atleta);
      });
    }
    $scope.trocaSexo = function() {
      $scope.atleta.sexo = $scope.masculinoSelecionado ? 'MA' : 'FE';
    };
    $scope.salvarAdicionar = function(formEdicao) {
      $scope.enviandoEdicao(formEdicao, true);
    };
    $scope.enviandoEdicao = function(formEdicao, novo) {
      if (!formEdicao.$valid) {
        SweetAlert.swal('Dados inválidos', 'Dados inválidos ou faltando. Verifique os campos obrigatórios *', 'error');
        return false;
      }
      if (criando) {
        Atleta.save(
          $scope.atleta,
          function(response) {
            SweetAlert.swal('Sucesso', 'Dados gravados com sucesso', 'success');
            if (novo) {
              $location.path('/atletas/new');
            }
            else {
              $location.path('/atletas');
            }
          },
          function(response) {
            SweetAlert.swal('Erro', 'Erro ao gravar os dados. Por favor, tente de novo', 'error');
          }
        );
      }
      else {
        Atleta.update(
          {id: $scope.id},
          $scope.atleta,
          function(response) {
            SweetAlert.swal('Sucesso', 'Dados gravados com sucesso', 'success');
            if (novo) {
              $location.path('/atletas/new');
            }
            else {
              $location.path('/atletas');
            }
          },
          function(response) {
            SweetAlert.swal('Erro', 'Erro ao gravar os dados. Por favor, tente de novo', 'error');
          }
        );
      }
    }
  }]);

