'use strict';

angular.module('concept2Admin.eventos', ['ngRoute'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/eventos', {
        templateUrl: '{0}/angular/crud/evento/lista.html'.format([urlBackEnd]),
        controller: 'EventosController'
      })
      .when('/eventos/:slug', {
        templateUrl: '{0}/angular/crud/evento/elemento.html'.format([urlBackEnd]),
        controller: 'EventoController'
      });
  }])
  .controller("EventosController", ['$rootScope', '$scope', 'Evento', function($rootScope, $scope, Evento) {
    $rootScope.pagina = "eventos";
    $rootScope.titulo = "Eventos";
    $scope.lista = Evento.query();
  }])
  .controller("EventoController", ['$rootScope', '$routeParams', '$scope', '$route', 'Upload', 'Evento', 'Inscricao', 'Prova', 'SweetAlert', function($rootScope, $routeParams, $scope, $route, Upload, Evento, Inscricao, Prova, SweetAlert) {
    $scope.slug = $routeParams.slug;
    $rootScope.pagina = "evento";
    $rootScope.titulo = "Evento";
    $scope.currentTab = 'inscricoes';
    $scope.colocacoes = [1, 2, 3, 4, 5, 6, 7, 8];
    $scope.activateTab = function(tab) {
      $scope.currentTab = tab;
    };
    Evento.get({id: $scope.slug}, function(evento) {
      $scope.evento = evento;
      $scope.evento.dataFimCompleta = new Date($scope.evento.dataFimCompleta);
      $scope.evento.dataInicioCompleta = new Date($scope.evento.dataInicioCompleta);
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
      $scope.evento.pontuacao.push(
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
      $scope.evento.pontuacao.splice(indice, 1);
    };
    $scope.enviandoEdicao = function(formEdicao) {
      if (!formEdicao.$valid) {
        SweetAlert.swal('Dados inválidos', 'Dados invpalidos ou faltando. Verifique os campos obrigatórios *', 'error');
        return false;
      }
      console.log($scope.evento.dataInicioCompleta);
      Evento.update(
        {id: $scope.slug},
        $scope.evento,
        function(response) {
          SweetAlert.swal('Sucesso', 'Dados gravados com sucesso', 'success');
        },
        function(response) {
          SweetAlert.swal('Erro', 'Erro ao gravar os dados. Por favor, tente de novo', 'error');
        }
      )
    }
  }]);

