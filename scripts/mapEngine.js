$(document).ready(function() {
	navigator.geolocation.getCurrentPosition(geoSuccess, geoError, {maximumAge: 20000, timeout: 10000, enableHighAccuracy: true});
});

var geoSuccess = function (position) {
	console.log(position.coords.latitude,position.coords.longitude);
	$('#lat').append(position.coords.latitude);
	$('#lng').append(position.coords.longitude);
}

var geoError = function (position) {
	console.log('geolocation error');
}
  	