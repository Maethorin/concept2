'use strict';
angular.module('concept.comunidade',['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/comunidade', {
                templateUrl: 'comunidade/comunidade.html',
                controller: 'ComunidadeController'
            })
    }])

    .controller('ComunidadeController', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {
        $rootScope.cssPagina = "pagina-comunidade"
        $rootScope.titulo = "Comunidade"
        $scope.comunidade = []
        $http.get('/comunidade/comunidade.json').then(function (response) {
            $scope.comunidade = response.data;
        });
        //$http.jsonp('https://maps.googleapis.com/maps/api/js?key=AIzaSyAPtVcOptYSliotWo2NfjRYgUXc0RgNjgc&libraries=places&callback=initAutocomplete')
    }])



 //.directive('loading', ['$http', function($http){
 //       return{
 //           restrict: 'A',
 //           link: function(scope, elm, attrs){
 //               scope.isLoading = function(){
 //                   return $http.pendingRequests.length > 0
 //               };
 //               scope.$watch(scope.isLoading, function(v){
 //                   var carregando = $(attrs['loading']);
 //                   if (v){
 //                       carregando.hide();
 //                       $(elm).show();
 //                   }else{
 //                       carregando.show();
 //                       $(elm).hide();
 //                   }
 //               });
 //           }
 //       }
 //   }])


//var map;
//var vm = this;
//
//function initAutocomplete() {
//    var mylatlng = {lat: -14.235004, lng: -51.92528};
//    var map = new google.maps.Map(document.getElementById('mapa'), {
//        center: mylatlng,
//        zoom: 4,
//        zoomControl: false,
//        mapTypeControl: false,
//        streetViewControl: false,
//        mapTypeId: google.maps.MapTypeId.TERRAIN
//    });
//    var image = 'static/concept2-amarelo.png';
//
//    function carregarPontos() {
//        $.getJSON('/comunidade/comunidade.json', function (pontos) {
//            $.each(pontos, function (index, ponto) {
//                var marker = new google.maps.Marker({
//                    position: new google.maps.LatLng(ponto.Latitude, ponto.Longitude),
//                    title: ponto.titulo,
//                    map: map,
//                    icon: ponto.icone
//
//                })
//            });
//        });
//
//    }
//
//    carregarPontos();
//
//    vm.showMarkers = function () {
//        for (var key in vm.map.marker) {
//            vm.map.markers[key].setMap(vm.map);
//        }
//        ;
//    };
//    vm.hideMarkers = function () {
//        for (var kei in vm.map.markers) {
//            vm.map.markers[key].setMap(null);
//        }
//        ;
//    };
//    var input = $('#pac-input');
//    var searchBox = new google.maps.places.SearchBox(input[0]);
//    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input[0]);
//    map.addListener('bounds_changed', function () {
//        searchBox.setBounds(map.getBounds());
//        input.show();
//    });
//    var markers = [];
//    searchBox.addListener('places_changed', function () {
//        var places = searchBox.getPlaces();
//
//        if (places.length == 0) {
//            return;
//        }
//        markers.forEach(function (marker) {
//            marker.setMap();
//        });
//        markers = [];
//        var bounds = new google.maps.LatLngBounds();
//        places.forEach(function (place) {
//            var icon = {
//                url: place.icon,
//                size: new google.maps.Size(71, 71),
//                origin: new google.maps.Point(0, 0),
//                anchor: new google.maps.Point(17, 34),
//                scaledSize: new google.maps.Size(25, 25)
//            };
//            markers.push(new google.maps.Marker({
//                map: map,
//                icon: icon,
//                title: place.name,
//                position: place.geometry.location
//            }));
//            if (place.geometry.viewport) {
//                bounds.union(place.geometry.viewport);
//            } else {
//                bounds.extend(place.geometry.location);
//            }
//        });
//        map.fitBounds(bounds);
//
//
//    })
//}
//
