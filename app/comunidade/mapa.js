var map;
function initMap() {
    var mylatlng = {lat: -14.235004, lng: -51.92528};
    map = new google.maps.Map(document.getElementById('mapa'), {
        center: mylatlng,
        zoom: 4,
        zoomControl: false,
        mapTypeControl: false,
        streetViewControl: false
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
}







