"use strict";

var initialize = function() {
    var mapOptions = {
        center: { lat: 39.0, lng: -98 },
        zoom: 3
    };
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
      