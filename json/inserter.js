var authorization = "Basic bmVvNGo6bW9uc3RlcnM=";

$.parseData = function parseData(data) {
	$.each(data, function(key, value) {
		console.log(value);
		$.addBuilding(value);
		if(typeof(value.coordinates) != "undefined"){
			$.addCoordinates(value.coordinates);
		}
		if(typeof(value.interior_markers) != "undefined"){
			$.addInteriorMarkers(value.interior_markers);
		}
	});
}

$.addBuilding = function addBuilding(building) {
	console.log(building.name);
	var name = building.name;
	var description = building.description;
	var image = building.image;
	var markerimage = building.markerimage;
	var lat = building.lat;
	var long = building.long;
	var url = "http://localhost:7474/db/data/transaction/commit";
	var data = {"statements":[{"statement":"CREATE (b:Building { name: '"+name+"', description: '"+description+"', image: '"+image+"', markerimage: '"+markerimage+"', lat: '"+lat+"', long: '"+long+"'})"}]};
	$.ajax({
		method: "POST",
		url: url,
		dataType: "json",
		contentType: "application/json",
		headers: {
			"Authorization": authorization
		},
		data: JSON.stringify(data)
	})
	.done(function(data) {
		console.log('success creating building');
	})
	.error(function(jqXHR,textStatus,errorThrown) {
		console.log("error creating building");
	})
}

$.addCoordinates = function addCoordinates(coordinates) {
	var building;
	var lat;
	var long;
	var url = "http://localhost:7474/db/data/transaction/commit";
	var data;
	$.each(coordinates, function(key, value) {
		building = value.building;
		lat = value.lat;
		long = value.long;
		data = {"statements":[{"statement":"CREATE (c:Coordinate { building: '"+building+"', lat: '"+lat+"', long: '"+long+"'})"}]};
		$.ajax({
			method: "POST",
			url: url,
			dataType: "json",
			contentType: "application/json",
			headers: {
				"Authorization": authorization
			},
			data: JSON.stringify(data)
		})
		.done(function(data) {
			console.log('success creating coordinate');
		})
		.error(function(jqXHR,textStatus,errorThrown) {
			console.log("error creating coordinate");
		})
	});
}

$.addInteriorMarkers = function addInteriorMarker(interiorMarker) {
	var building;
	var name;
	var lat;
	var long;
	var locationimage;
	var markerimage;
	var url = "http://localhost:7474/db/data/transaction/commit";
	var data;
	$.each(interiorMarker, function(key, value) {
		building = value.building;
		name = value.name;
		lat = value.lat;
		long = value.long;
		locationimage = value.locationimage;
		markerimage = value.markerimage;
		data = {"statements":[{"statement":"CREATE (i:InteriorMarker { building: '"+building+"', name: '"+name+"', lat: '"+lat+"', long: '"+long+"', locationimage: '"+locationimage+"', markerimage: '"+markerimage+"'})"}]};
		$.ajax({
			method: "POST",
			url: url,
			dataType: "json",
			contentType: "application/json",
			headers: {
				"Authorization": authorization
			},
			data: JSON.stringify(data)
		})
		.done(function(data) {
			console.log('success creating interior marker');
		})
		.error(function(jqXHR,textStatus,errorThrown) {
			console.log("error creating interior marker");
		})
	});
}

$(document).ready(function() {
	var json = $.getJSON( "data.json", function(data) {
		$.parseData(data);
	})
	.fail(function() {
		console.log( "failed to load json" );
	})
});