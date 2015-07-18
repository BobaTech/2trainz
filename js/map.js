"use strict";
// var heatmap, map;

// var initialize = function() {
// 	var minZoomLevel = 5;
//     var mapOptions = {
//         center: { lat: 39.0, lng: -98 },
//         zoom: minZoomLevel,
//         heatmap: { enabled: true }
//     };
//     map = new google.maps.Map(document.getElementById("map"), mapOptions);
//     map.data.loadGeoJson("data/us-railroads-10m.json");

//     $.getJSON("data/casualties.geo.json", function(data) {
//         console.log(data);
//         var heatPoints = data.features.map(function(row, i) {
//             return new google.maps.LatLng(row.geometry.coordinates[1], row.geometry.coordinates[0]);
//             //alert(point)
//         });

//         heatmap = new google.maps.visualization.HeatmapLayer({
//             data: heatPoints
//         });
//         console.log(heatmap);
//         heatmap.setMap(map);
//         /*var plotData = data.features.map(function(row, i) {
//             return new google.maps.Marker({"position": new google.maps.LatLng(row.geometry.coordinates[1], row.geometry.coordinates[0])});
//         });
//         var markerCluster = new MarkerClusterer(map, plotData);*/
        
// 	});
//         //var markerCluster = new MarkerClusterer(map, plotData);
    
//     $.getJSON("data/us-railroads-10m.json", function(us){
// 		geoJsonObject = topojson.feature(us, us.object.railroads);
// 		map.data.addGeoJson(geoJsonObject); 
// 	}); 
    
    
//     var allowedBounds = new google.maps.LatLngBounds(
// 	    new google.maps.LatLng(32.314308, -126.067097), 
// 	    new google.maps.LatLng(44.301400, -70.226309)
// 	);
	
// 	google.maps.event.addListener(map, 'drag', function() {
// 	    if (allowedBounds.contains(map.getCenter())){
// 	    	return;
// 	    } 
// 	    var center = map.getCenter(),
// 	        x = center.lng(),
// 	        y = center.lat(),
// 	        maxX = allowedBounds.getNorthEast().lng(),
// 	        maxY = allowedBounds.getNorthEast().lat(),
// 	        minX = allowedBounds.getSouthWest().lng(),
// 	        minY = allowedBounds.getSouthWest().lat();
	
// 	    if (x < minX){
// 	    	x = minX;
// 	    }
// 	    if (x > maxX){
// 	    	x = maxX;	
// 	    } 
// 	    if (y < minY){
// 	    	y = minY;
// 	    } 
// 	    if (y > maxY){ 
// 	    	y = maxY;
// 	    }
// 	    map.setCenter(new google.maps.LatLng(y, x));
// 	});
	
// 	google.maps.event.addListener(map, 'zoom_changed', function() {
// 	   if (map.getZoom() < minZoomLevel){
// 	   	   map.setZoom(minZoomLevel);
// 	   } 
// 	});

//     google.maps.visualRefresh = false;
// };


// $(document).ready(function() {
//     google.maps.event.addDomListener(window, "load", initialize);
// });

var plot = function() {
    var map = L.map("map").setView([39.0, -98], 5);
    L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        id: "cakesofwrath.5eddf8f1",
        accessToken: "pk.eyJ1IjoiY2FrZXNvZndyYXRoIiwiYSI6Ijk5YWI3OTlhMGIxN2I1OWYzYjhlOWJmYjEwNTRjODU0In0._RjYIzLsA5cU-YM6dxGOLQ" 
        }).addTo(map);
    var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#FF0000",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
    $.getJSON("data/casualties.geo.json", function(data) {
        /*L.geoJson(data, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, geojsonMarkerOptions);
            }
        }).addTo(map);*/
        var heatPoints = data.features.map(function(row, i) {
            return new L.LatLng(row.geometry.coordinates[1], row.geometry.coordinates[0]);
        });
        L.heatLayer(heatPoints, {
            radius: 25,
            gradient: {0.4: 'blue', 0.65: 'lime', 1: 'red'},
            maxZoom: 11
        }).addTo(map);
    });
    $.getJSON("data/us-railroads-10m.json", function(data) {
        L.geoJson().addTo(map).addData(data);
    });
    
};

$(document).ready(plot);

      

