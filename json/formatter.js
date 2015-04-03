var authorization = "Basic bmVvNGo6bW9uc3RlcnM=";
var building = "Building543";

$.getBuilding = function getBuilding(building) {
	var defer = $.Deferred();
	var url = "http://localhost:7474/db/data/transaction/commit";
	var data = {"statements":[{"statement":"MATCH (n:Building { name:'"+building+"' }) RETURN n LIMIT 1;"}]};
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
		defer.resolve(data);
	})
	.error(function(jqXHR,textStatus,errorThrown) {
		console.log("error getting building "+building+" : "+errorThrown);
	})
	return defer.promise();
}

$.getBuildingCoordinates = function getBuildingCoordinates(building) {
	var defer = $.Deferred();
	var url = "http://localhost:7474/db/data/transaction/commit";
	var data = {"statements":[{"statement":"MATCH (n:Coordinate { building:'"+building+"' }) RETURN n;"}]};
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
		defer.resolve(data);
	})
	.error(function(jqXHR,textStatus,errorThrown) {
		console.log("error getting building coordinates "+building+" : "+errorThrown);
	})
	return defer.promise();
}

$.getBuildingInteriorMarkers = function getBuildingInteriorMarkers(building) {
	var defer = $.Deferred();
	var url = "http://localhost:7474/db/data/transaction/commit";
	var data = {"statements":[{"statement":"MATCH (n:InteriorMarker { building:'"+building+"' }) RETURN n;"}]};
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
		defer.resolve(data);
	})
	.error(function(jqXHR,textStatus,errorThrown) {
		console.log("error getting building interior markers "+building+" : "+errorThrown);
	})
	return defer.promise();
}

$.formatBuildingData = function(buildingData,buildingCoordinatesData,buildingInteriorMarkersData){
	var formattedData;
	var building = buildingData.results[0].data[0].row[0];
	var buildingCoordinates = buildingCoordinatesData.results[0].data;
	var buildingInteriorMarkers = buildingInteriorMarkersData.results[0].data;
	formattedData = [{name : building.name, description : building.description, image: building.image, coordinates: [], interior_markers: []}];
	$.each(buildingCoordinates, function(key, value) {
		formattedData[0]['coordinates'].push(value.row[0]);
	});
	$.each(buildingInteriorMarkers, function(key, value) {
		formattedData[0]['interior_markers'].push(value.row[0]);
	});
	return formattedData;
}

$(document).ready(function() {
	$.when(
		$.getBuilding(building),
		$.getBuildingCoordinates(building),
		$.getBuildingInteriorMarkers(building)
	).done(function(buildingData,buildingCoordinatesData,buildingInteriorMarkersData) {
		formattedData = $.formatBuildingData(buildingData,buildingCoordinatesData,buildingInteriorMarkersData);
		$("#formattedData").html(JSON.stringify(formattedData));
		console.log(formattedData);
	});
});