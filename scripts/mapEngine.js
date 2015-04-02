var buildingData = [];
var lastSelectedMenu = -1;

var autoGeolocation = function() {
  navigator.geolocation.getCurrentPosition(geoSuccess, geoError, {maximumAge: 20000, timeout: 10000, enableHighAccuracy: true});
}

var geoSuccess = function (position) {
	$('#lat').append(position.coords.latitude);
	$('#lng').append(position.coords.longitude);
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
      lastSelectedMenu = localStorage.getItem("URBN-Building") > -1 ? localStorage.getItem("URBN-Building") : 0;

      $.each(buildingData, function(index, element) {
        var mainMenu = $('.monster-main-menu');
        var breadCrumb = $('.breadcrumb');

        mainMenu.append("<li onclick='loadBuildingDetails(" + index + ")'>" + buildingData[index].name + "</li>");
        
        //Initial breadcrumb setup
        breadCrumb.empty();
        breadCrumb.append("<li>" + buildingData[lastSelectedMenu].name + "</li>");
      });
    }
  });
}

var loadBuildingDetails = function(buildingId) {
  var breadCrumb = $('.breadcrumb');

  breadCrumb.empty();
  breadCrumb.append("<li>" + buildingData[buildingId].name + "</li>");
  localStorage.setItem("URBN-Building", buildingId);
}

$(document).ready(function() {

  //Read in the location menu options
  readMenu();

  //Detect up the geolocation
  autoGeolocation();
});
  	