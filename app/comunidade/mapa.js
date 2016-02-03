function initialize() {

// Exibir mapa;
  var myLatlng = new google.maps.LatLng(-22.9068467, -43.1728965);
  var mapOptions = {
  zoom: 4,
  center: myLatlng,
  streetViewControl: false,
  mapTypeControl: false,
  zoomControl: false,
  mapTypeId: google.maps.MapTypeId.ROADMAP
}

// Exibir o mapa na div #mapa;
  var map = new google.maps.Map(document.getElementById("mapa"), mapOptions);

}
function loadScript() {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src ="http://maps.googleapis.com/maps/api/js?key=AIzaSyAPtVcOptYSliotWo2NfjRYgUXc0RgNjgc&callback=initialize";

  document.body.appendChild(script);
}

  window.onload = loadScript;
// Marcador personalizado;
  var image = "material-design/concept2-onde-remae-amarelo.png";
  var marcadorpersonalizado = new google.maps.Marker({
  position: (-22.9068467, -43.1728965),
  icon: image,
  animation: google.maps.Animation.DROP
});