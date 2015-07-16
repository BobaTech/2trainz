"use strict";

var initialize = function() {
	var minZoomLevel = 3;
    var mapOptions = {
        center: { lat: 39.0, lng: -98 },
        zoom: minZoomLevel
    };
    var allowedBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(39.368149, -65.915875), 
    new google.maps.LatLng(39.368149, -127.798348)
	);
	
	google.maps.event.addListener(map, 'dragend', function() {
	    if (allowedBounds.contains(map.getCenter())) return;
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
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    map.data.loadGeoJson("data/casualties.geo.json");
    map.data.loadGeoJson("data/us-railroads-10m.json");
};

$(document).ready(function() {
    google.maps.event.addDomListener(window, "load", initialize);
    console.log("done");
});


/*$.getJSON("data/us-railroads.json", function(data){
	
	var map = new google.maps.Map(document.getElementById("map"), mapOptions);
	map.data.addGeoJson(geoJsonObject); 
}); */
      

