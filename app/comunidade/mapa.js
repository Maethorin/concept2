var map;
function initAutocomplete() {
    var mylatlng = {lat: -14.235004, lng: -51.92528};
   var map = new google.maps.Map(document.getElementById('mapa'), {
        center: mylatlng,
        zoom: 4,
        zoomControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        mapTypeId: google.maps.MapTypeId.TERRAIN
    });

    var image = 'static/concept2-amarelo.png';
       function carregarPontos(){
           $.getJSON('/comunidade/comunidade.json', function(pontos){
               $.each(pontos, function(index, ponto){
                   var marker= new google.maps.Marker({
                       position: new google.maps.LatLng(ponto.Latitude, ponto.Longitude),
                       title:"pontos!!",
                       map:map,
                       icon: ponto.icone

                   })
               });
            });


       }
     carregarPontos();

    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });
     var markers = [];
     searchBox.addListener('places_changed', function() {
         var places = searchBox.getPlaces();

         if (places.length == 0) {
             return;
         }
         markers.forEach(function(marker) {
      marker.setMap();
      });
         markers = [];
     var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
        };
    markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));
 if (place.geometry.viewport) {
     bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);




})
    }






