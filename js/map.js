"use strict";

var map, heatMap, casData, accData, baseLayer, panelLayer, accLayer, casLayer, dmgLayer, fatLayer,
    currYear = "2014",
    accidentOptions = {
        "radius": 25,
        "maxZoom": 11,
        "gradient": {0.4: "blue", 0.65: "lime", 1: "red"} 
    },
    casualtyOptions = {
        "radius": 25,
        "maxZoom": 11,
        "gradient": {0.4: "blue", 0.65: "lime", 1: "red"}       
    },
    damageOptions = {
        "radius": 25,
        "maxZoom": 11,
        "gradient": {0.4: "blue", 0.65: "lime", 1: "red"} 
    },
    fatalityOptions = {
        "radius": 25,
        "maxZoom": 11,
        "gradient": {0.4: "blue", 0.65: "lime", 1: "red"} 
    };
    
var southWest = new L.latLng(32.314308, -126.067097),
    northEast = new L.latLng(44.301400, -61.226309),
    bounds = new L.latLngBounds(southWest, northEast);

var plot = function() {
    var map = new L.map("map", {
	    maxBounds: bounds,
	    maxZoom: 10,
	    minZoom: 5
	});
    map.setView([39.0, -98], 5);
    baseLayer = new L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        id: "cakesofwrath.5eddf8f1",
        accessToken: "pk.eyJ1IjoiY2FrZXNvZndyYXRoIiwiYSI6Ijk5YWI3OTlhMGIxN2I1OWYzYjhlOWJmYjEwNTRjODU0In0._RjYIzLsA5cU-YM6dxGOLQ" 
        });
    baseLayer.addTo(map);
    var baseLayers = [
        {
            active: true,
            name: "OpenStreetMap",
            layer: baseLayer
        }
    ];
    var overLayers = [
        {
            name: "Accidents",
            layer: null
        },
        {
            name: "Accidents with Damage Weight",
            layer: null
        },
        {
            name: "Injuries and Fatalities",
            layer: null
        },
        {
            name: "Fatalities",
            layer: null
        }
    ];

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
        accData = data;
        overLayers[0].layer = accLayer = new L.heatLayer(accData[currYear].map(function(row) {
            return [row[0], row[1]];
        }), accidentOptions);
        overLayers[1].layer = dmgLayer = new L.heatLayer(accData[currYear], damageOptions);

        $.getJSON("data/casualties/casualties_all_latlng.json", function(data) {
            casData = data;
            overLayers[2].layer = casLayer = new L.heatLayer(casData[currYear].map(function(row) {
                return [row[0], row[1]];
            }), casualtyOptions);
            overLayers[3].layer = fatLayer = new L.heatLayer(casData[currYear].filter(function(row) {
                return row[2];
            }), fatalityOptions);
            
            panelLayer = new L.Control.PanelLayers(baseLayers, overLayers).addTo(map);
        });
    });

    map.fitBounds(bounds);
};

var switchYear = function(year) {
    if(accData && casData && year in accData && year in casData) {
        currYear = year;

        accLayer.setLatLngs(accData[currYear].map(function(row) {
            return [row[0], row[1]];
        }));
        dmgLayer.setLatLngs(accData[currYear]);
        casLayer.setLatLngs(casData[currYear].map(function(row) {
            return [row[0], row[1]];
        }));
        fatLayer.setLatLngs(casData[currYear].filter(function(row) {
            return row[2];
        }));
    }
    
};

$(document).ready(plot);
