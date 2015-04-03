var buildingData = [];
var markerData = [];
var drawnMarkers = [];
var lastSelectedMenu = -1;
var monsterMap;
var startLat;
var startLong;


var autoGeolocation = function() {
  navigator.geolocation.getCurrentPosition(geoSuccess, geoError, {maximumAge: 20000, timeout: 10000, enableHighAccuracy: true});

}

var geoSuccess = function (position) {
  $('#lat').append(position.coords.latitude);
	$('#lng').append(position.coords.longitude);
  startLat = 39.8885523;
  startLong = -75.1763572;

  updateMap(39.8885523,-75.1763572);
}

var geoError = function (position) {
	console.log('geolocation error');
}

var readMenu = function () {
  $.ajax({
    dataType: "json",
    url: "json/data.json",
    success: function (data) {  
      buildingData = data;
      lastSelectedMenu = localStorage.getItem("URBN-Building") != null ? localStorage.getItem("URBN-Building") : 0;

      $.each(buildingData, function(index, element) {
        var mainMenu = $('.monster-main-menu');
        var contentTitle = $('.monsters-building-title');

        mainMenu.append("<li onclick='loadBuildingDetails(" + index + ")'>" + buildingData[index].name + "</li>");
        
        //Initial breadcrumb setup
        contentTitle.empty();
        contentTitle.append(buildingData[lastSelectedMenu].name);
      });

      markerData = buildingData[lastSelectedMenu].interior_markers;

      readPoints();
    }
  });
}

var readPoints = function () {
  var pointsBox = $('.monsters-points');

  pointsBox.empty();

  if(buildingData[lastSelectedMenu].image) {
    pointsBox.append("<div style='background-image: url(" + buildingData[lastSelectedMenu].image + ")' class='monsters-building-image'></div>");
  }

  pointsBox.append("<div class='monsters-description'>" + buildingData[lastSelectedMenu].description + "</div>");

  if(markerData) {
    $.each(markerData, function(index, element) {
      pointsBox.append("<li onclick='drawMarker(" + index + ")' class='monsters-point-bullet'>" + markerData[index].name + "</li>");
    });
  } else {
    drawMarker(null, buildingData[lastSelectedMenu]);
  }


}

var drawMarker = function(markerDataIndex, buildingData) {

  var currentData = null;

  console.log(markerDataIndex, buildingData);

  if(markerDataIndex !== null) {
    currentData = markerData[markerDataIndex];
  } else if(buildingData) {
    currentData = buildingData;
  }

  //Reset current markers
  $.each(drawnMarkers, function(index, element) {
    drawnMarkers[index].setMap(null);
  })

  var currentPositionMarker = new google.maps.Marker({
      map: monsterMap,
      animation: google.maps.Animation.BOUNCE,
      position: new google.maps.LatLng(
          currentData.lat,
          currentData.long
      ),
      title: currentData.name,
      icon: currentData.markerimage
  });

  setTimeout(function() {
    currentPositionMarker.setAnimation(null);
  },3000);

  drawnMarkers.push(currentPositionMarker);

  var infoContent = currentData.locationimage ? "<b>" + currentData.name + "</b>" +
              "<div class='monsters-info-image' style='background-image: url(" + currentData.locationimage + ")'></div>" :
              currentData.description ? 
              "<b>" + currentData.name + "</b>" + 
              "<div class='monsters-info-description'>" + currentData.description + "</div>" : 
              "<b>" + currentData.name + "</b>";



  infoContent = infoContent + "<div class='monsters-directions'><a target='_blank' href='http://maps.google.com/maps?saddr=" + startLat + "," + startLong + "&daddr=" + currentData.lat + "," + currentData.long + "'>Get Directions</a></div>"

  var infowindow = new google.maps.InfoWindow({
    content: infoContent
  });

  google.maps.event.addListener(currentPositionMarker, 'click', function() {
    infowindow.open(monsterMap,currentPositionMarker);
    currentPositionMarker.setAnimation(null);
  });

  monsterMap.panTo(new google.maps.LatLng(
                        currentData.lat,
                        currentData.long
                    ));
}

var loadBuildingDetails = function(buildingId) {
  var contentTitle = $('.monsters-building-title');

  contentTitle.empty();
  contentTitle.append(buildingData[buildingId].name);
  localStorage.setItem("URBN-Building", buildingId);
  lastSelectedMenu = buildingId;

  markerData = buildingData[buildingId].interior_markers;

  readPoints();
}

$(document).ready(function() {

  //Read in the location menu options
  readMenu();

  //Detect up the geolocation
  autoGeolocation();

  google.maps.event.addDomListener(window, 'load', initMap);
});


var updateMap = function(lat, lng) {

  var infowindow = new google.maps.InfoWindow({
    content: "<div class='monsters-marker-title'>You are here!</div>"
  });

  var currentPositionMarker = new google.maps.Marker({
      map: monsterMap,
      position: new google.maps.LatLng(
          lat,
          lng
      ),
      title: "You are here!",
      icon: "/app/images/locator-marker.png"
  });

  google.maps.event.addListener(currentPositionMarker, 'click', function() {
    infowindow.open(monsterMap,currentPositionMarker);
  });

}


var initMap = function() {

  var mapStyles = [
                        {
                            "featureType": "administrative",
                            "elementType": "geometry.stroke",
                            "stylers": [
                                {
                                    "visibility": "on"
                                },
                                {
                                    "color": "#00adc4"
                                },
                                {
                                    "weight": "0.30"
                                },
                                {
                                    "saturation": "-75"
                                },
                                {
                                    "lightness": "5"
                                },
                                {
                                    "gamma": "1"
                                }
                            ]
                        },
                        {
                            "featureType": "administrative",
                            "elementType": "labels.text.fill",
                            "stylers": [
                                {
                                    "color": "#00adc4"
                                },
                                {
                                    "saturation": "-75"
                                },
                                {
                                    "lightness": "5"
                                }
                            ]
                        },
                        {
                            "featureType": "administrative",
                            "elementType": "labels.text.stroke",
                            "stylers": [
                                {
                                    "color": "#ffe979"
                                },
                                {
                                    "visibility": "on"
                                },
                                {
                                    "weight": "6"
                                },
                                {
                                    "saturation": "-28"
                                },
                                {
                                    "lightness": "0"
                                }
                            ]
                        },
                        {
                            "featureType": "administrative",
                            "elementType": "labels.icon",
                            "stylers": [
                                {
                                    "visibility": "off"
                                },
                                {
                                    "color": "#e6007e"
                                },
                                {
                                    "weight": "1"
                                }
                            ]
                        },
                        {
                          "featureType": "landscape.man_made",
                          "stylers": [
                            { "visibility": "on" }
                          ]
                        },
                        {
                            "featureType": "landscape.natural",
                            "elementType": "all",
                            "stylers": [
                                {
                                    "color": "#ffeb81"
                                },
                                {
                                    "saturation": "-28"
                                },
                                {
                                    "lightness": "0"
                                }
                            ]
                        },
                        {
                            "featureType": "poi",
                            "elementType": "all",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                          "featureType": "poi.business",
                          "elementType": "all",
                          "stylers": [
                            { "visibility": "on" }
                          ]
                        },
                        {
                            "featureType": "road",
                            "elementType": "all",
                            "stylers": [
                                {
                                    "color": "#0096aa"
                                },
                                {
                                    "visibility": "on"
                                },
                                {
                                    "saturation": "-75"
                                },
                                {
                                    "lightness": "5"
                                },
                                {
                                    "gamma": "1"
                                }
                            ]
                        },
                        {
                            "featureType": "road",
                            "elementType": "labels.text",
                            "stylers": [
                                {
                                    "visibility": "on"
                                },
                                {
                                    "color": "#ffe146"
                                },
                                {
                                    "weight": "8"
                                },
                                {
                                    "saturation": "-28"
                                },
                                {
                                    "lightness": "0"
                                }
                            ]
                        },
                        {
                            "featureType": "road",
                            "elementType": "labels.text.fill",
                            "stylers": [
                                {
                                    "visibility": "on"
                                },
                                {
                                    "color": "#0096aa"
                                },
                                {
                                    "weight": "8"
                                },
                                {
                                    "lightness": "5"
                                },
                                {
                                    "gamma": "1"
                                },
                                {
                                    "saturation": "-75"
                                }
                            ]
                        },
                        {
                            "featureType": "road",
                            "elementType": "labels.icon",
                            "stylers": [
                                {
                                    "visibility": "on"
                                }
                            ]
                        },
                        {
                            "featureType": "transit",
                            "elementType": "all",
                            "stylers": [
                                {
                                    "visibility": "off"
                                },
                                {
                                    "color": "#0096aa"
                                },
                                {
                                    "saturation": "-75"
                                },
                                {
                                    "lightness": "5"
                                },
                                {
                                    "gamma": "1"
                                }
                            ]
                        },
                        {
                            "featureType": "water",
                            "elementType": "geometry.fill",
                            "stylers": [
                                {
                                    "visibility": "on"
                                },
                                {
                                    "color": "#0096aa"
                                },
                                {
                                    "saturation": "-75"
                                },
                                {
                                    "lightness": "5"
                                },
                                {
                                    "gamma": "1"
                                }
                            ]
                        },
                        {
                            "featureType": "water",
                            "elementType": "labels.text",
                            "stylers": [
                                {
                                    "visibility": "on"
                                },
                                {
                                    "color": "#ffe146"
                                },
                                {
                                    "saturation": "-28"
                                },
                                {
                                    "lightness": "0"
                                }
                            ]
                        },
                        {
                            "featureType": "water",
                            "elementType": "labels.icon",
                            "stylers": [
                                {
                                    "visibility": "on"
                                }
                            ]
                        }
                    ];

  var mapOpts = {
    center: new google.maps.LatLng(39.8892816,-75.1757082),
    zoom: 17,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: mapStyles
  };

  monsterMap = new google.maps.Map(document.getElementById("monsters-map"), mapOpts);
}


  	