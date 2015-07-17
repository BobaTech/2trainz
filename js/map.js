"use strict";

var initialize = function() {
	var minZoomLevel = 5;
    var mapOptions = {
        center: { lat: 39.0, lng: -98 },
        zoom: minZoomLevel
    };
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    // map.data.loadGeoJson("data/casualties.geo.json");
    $.getJSON("data/casualties.geo.json", function(data) {
        var plotData = data.features.map(function(row, i) {
            return new google.maps.Marker({"position": new google.maps.LatLng(row.geometry.coordinates[1], row.geometry.coordinates[0])})
        });
        var markerCluster = new MarkerClusterer(map, plotData);
    });
    map.data.loadGeoJson("data/us-railroads-10m.json");
    var allowedBounds = new google.maps.LatLngBounds(
	    new google.maps.LatLng(32.314308, -126.067097), 
	    new google.maps.LatLng(44.301400, -61.226309)
	);
	
	google.maps.event.addListener(map, 'dragend', function() {
	    if (allowedBounds.contains(map.getCenter())){
	    	return;
	    } 
	    var center = map.getCenter(),
	        x = center.lng(),
	        y = center.lat(),
	        maxX = allowedBounds.getNorthEast().lng(),
	        maxY = allowedBounds.getNorthEast().lat(),
	        minX = allowedBounds.getSouthWest().lng(),
	        minY = allowedBounds.getSouthWest().lat();
	
	    if (x < minX){
	    	x = minX;
	    }
	    if (x > maxX){
	    	x = maxX;	
	    } 
	    if (y < minY){
	    	y = minY;
	    } 
	    if (y > maxY){ 
	    	y = maxY;
	    }
	    map.setCenter(new google.maps.LatLng(y, x));
	});
	
	google.maps.event.addListener(map, 'zoom_changed', function() {
	   if (map.getZoom() < minZoomLevel) map.setZoom(minZoomLevel);
	});

    google.maps.visualRefresh = false;
};

$(document).ready(function() {
    google.maps.event.addDomListener(window, "load", initialize);
});


/*$.getJSON("data/us-railroads.json", function(data){
	
	var map = new google.maps.Map(document.getElementById("map"), mapOptions);
	map.data.addGeoJson(geoJsonObject); 
}); */
      

