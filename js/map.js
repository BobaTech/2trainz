"use strict";

var map, heatMap, currType = "casualties", casData, accData,
    casualtyOptions = {
        radius: 25,
        gradient: {0.05: 'blue', 0.2: 'lime', 0.5: 'red'},
        maxZoom: 11
    },
    accidentOptions = {
        radius: 25,
        gradient: {0.05: 'blue', 0.2: 'lime', 0.5: 'red'},
        maxZoom: 11
    };

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
    $.getJSON("data/casualties/casualties_2014.geo.json", function(data) {
        /*L.geoJson(data, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, geojsonMarkerOptions);
            }
        }).addTo(map);*/
        accData = data.features.map(function(row, i) {
            return new L.LatLng(row.geometry.coordinates[1], row.geometry.coordinates[0]);
        });
        heatMap = L.heatLayer(accData, casualtyOptions).addTo(map);
    });
    var myStyle = {
        "color": "#000",
        "weight": 1,
        "opacity": 0.65
    };
    $.getJSON("data/us-railroads-10m.json", function(data) {
        L.geoJson(data, {
            style: myStyle
        }).addTo(map);
    });
    $.getJSON("data/accidents/accidents_all_latlng.json", function(data) {
        console.log(data);
    });
    $.getJSON("data/casualties/casualties_all_latlng.json", function(data) {
        console.log(data);
    });
    
};

var switchData = function(type) {
    if(type === "casualties") {
        currType = type;
        $("#casualties").addClass("active");
        $("#accidents").removeClass("active");
        if(casData) {
            heatMap.setLatLngs(casData);
            heatMap.setOptions(casualtyOptions);      
        }
        else {
            $.getJSON("data/casualties/casualties_2014.geo.json", function(data) {
                var heatPoints = data.features.map(function(row, i) {
                    return new L.LatLng(row.geometry.coordinates[1], row.geometry.coordinates[0]);
                });
                casData = heatPoints;
                heatMap.setLatLngs(heatPoints);
                heatMap.setOptions(casualtyOptions);
            });
        }
    }
    else if(type === "accidents") {
        currType = type;
        $("#accidents").addClass("active");
        $("#casualties").removeClass("active");
        if(accData) {
            heatMap.setLatLngs(accData);
            heatMap.setOptions(casualtyOptions);
        }
        $.getJSON("data/accidents/accidents_2014.geo.json", function(data) {
            var heatPoints = data.features.map(function(row, i) {
                return new L.LatLng(row.geometry.coordinates[1], row.geometry.coordinates[0]);
            });
            accData = heatPoints;
            heatMap.setLatLngs(heatPoints);
            heatMap.setOptions(accidentOptions);
        });
    }
};

$(document).ready(plot);
