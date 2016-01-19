'use strict';
 onload = {
  init: function(){
    this.dynamicBanner();
    this.mascararCampos();
  },

aleatorio: 0,
  dynamicBanner: function(){
    setInterval(function(){
      this.aleatorio = Math.floor(Math.random() * 3);
      switch(this.aleatorio){
        case 0:
          $$('#bg').css({'background-image':'url("bower_components/html5-boilerplate/dist/css/fotos/fundo-home-1.jpg")', 'transition': '1.0s'});
          break;
        case 1:
          $$('#bg').css({'background-image':'url("bower_components/html5-boilerplate/dist/css/fotos/fundo-home-2.jpg")', 'transition':'1.0s'});
          break;
        case 2:
          $$('#bg').css({'background-image':'url("bower_components/html5-boilerplate/dist/css/fotos/fundo-home-3.jpg")', 'transition':'1.s'});
          break;
      }
    }, 6000);
  }
 }

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
