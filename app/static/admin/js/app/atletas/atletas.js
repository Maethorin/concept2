'use strict';

angular.module('concept2Admin.atletas', ['ngRoute'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/atletas', {
        templateUrl: '{0}/angular/crud/atleta/lista.html'.format([urlBackEnd]),
        controller: 'AtletasController'
      })
      .when('/atletas/new', {
        templateUrl: '{0}/angular/crud/atleta/elemento.html'.format([urlBackEnd]),
        controller: 'NovoAtletaController'
      })
      .when('/atletas/:slug', {
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
  .controller("AtletaController", ['$rootScope', '$routeParams', '$scope', '$route', 'Upload', 'Atleta', 'Inscricao', 'Prova', function($rootScope, $routeParams, $scope, $route, Upload, Atleta, Inscricao, Prova) {
    $scope.slug = $routeParams.slug;
    $rootScope.pagina = "atleta";
    $rootScope.titulo = "Atleta";
    $scope.currentTab = 'inscricoes';
    $scope.colocacoes = [1, 2, 3, 4, 5, 6, 7, 8];
    $scope.activateTab = function(tab) {
      $scope.currentTab = tab;
    };
    Atleta.get({id: $scope.slug}, function(atleta) {
      $scope.atleta = atleta;
      $scope.atleta.dataFimCompleta = new Date($scope.atleta.dataFimCompleta);
      $scope.atleta.dataInicioCompleta = new Date($scope.atleta.dataInicioCompleta);
    });
    
    $scope.statusProva = [
      {codigo: 'NA', nome: 'Não Aconteceu'},
      {codigo: 'CA', nome: 'Cancelada'},
      {codigo: 'EA', nome: 'Em Andamento'},
      {codigo: 'EP', nome: 'Em Apuração'},
      {codigo: 'FN', nome: 'Finalizada'},
      {codigo: 'PP', nome: 'Prova Prevista'}
    ];
    $scope.trocaStatusProva = function(prova, status) {
      Prova.update(
        {'id': prova.id},
        new Prova({'status': status.codigo}),
        function(response) {
          prova.status = response.status;
        },
        function(response) {
          alert('Erro')
        }
      );
      
    };
    $scope.marcarPago = function(inscricaoId) {
      var inscricao = new Inscricao({estahPago: true});
      Inscricao.update(
        {'id': inscricaoId},
        inscricao,
        function() {
          $route.reload();
        },
        function(response) {
          console.log(response);
          alert(response);
        }
      );
    };
    $scope.enviaArquivoResultado = function(file, errFiles) {
      if (file) {
        file.upload = Upload.upload({
          url: '{0}/resultado/{1}'.format([urlBackEnd, $scope.slug]),
          data: {resultado: file}
        });
        file.upload.then(
          function(response) {
            alert('Enviado com sucesso');
          },
          function(response) {
            alert('Erro');
          }
        );
      }
    };
    $scope.adicionaProvaNaPontuacao = function() {
      $scope.atleta.pontuacao.push(
        {
          "nome": null,
          "pontuacao": [
            {"colocacao": 1, "pontos": null},
            {"colocacao": 2, "pontos": null},
            {"colocacao": 3, "pontos": null},
            {"colocacao": 4, "pontos": null},
            {"colocacao": 5, "pontos": null},
            {"colocacao": 6, "pontos": null},
            {"colocacao": 7, "pontos": null},
            {"colocacao": 8, "pontos": null}
          ]
        }
      )
    };
    $scope.removerProvaDaPontuacao = function(indice) {
      $scope.atleta.pontuacao.splice(indice, 1);
    };
    $scope.enviandoEdicao = function(formEdicao) {
      if (!formEdicao.$valid) {
        alert('Dados invpalidos ou faltando. Verifique os campos obrigatórios *');
        return false;
      }
      console.log($scope.atleta.dataInicioCompleta);
      Atleta.update(
        {id: $scope.slug},
        $scope.atleta,
        function(response) {
          alert('Dados gravados com sucesso');
        },
        function(response) {
          alert('Erro ao gravar, por favor tente de novo.');
        }
      )
    }
  }]);

