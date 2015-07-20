"use strict";

// jshint undef:false

var map, heatMap, interval, casData, accData, baseLayer, panelLayer, accLayer, casLayer, dmgLayer, fatLayer,
    currYear = "2011",
    playYear = "2011",
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
        "maxZoom": 9,
        "gradient": {0.1: "blue", 0.2: "lime", 0.3: "red"} 
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
    /*$.getJSON("data/us-railroads-10m.json", function(data) {
        L.geoJson(data, {
            style: myStyle
        }).addTo(map);
    });*/
    $.getJSON("data/accidents/accidents_all_latlng.json", function(data) {
        accData = data;
        overLayers[0].layer = accLayer = new L.heatLayer(accData[currYear].map(function(row) {
            return [row[0], row[1]];
        }), accidentOptions);
        overLayers[1].layer = dmgLayer = new L.heatLayer(accData[currYear].map(function(row) {
            return [row[0], row[1], (parseInt(row[2]) / 145359.13510178903).toString()]; // that's the avg
        }), damageOptions);
        var sum = 0, ct = 0;
        for(var y in accData) {
            for(var i=0; i<accData[y].length; i++) {
                sum += parseInt(accData[y][i][2]);
                ct++;
            }
        }
        console.log(sum / ct);

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

    $(".year").click(function(e) {
        $("#y" + currYear).removeClass("active");
        if(interval) {
            clearInterval(interval);
            $("#play").removeClass("active");
            interval = null;
        }
        switchYear($(this).attr("id").substring(1));
    });

    $("#play").click(function() {
        $(this).toggleClass("active");
        if(interval) {
            clearInterval(interval);
            interval = null;
        }
        else {
            playYear = "2011";
            $(".year").removeClass("active");
            $("#y2011").addClass("active"); // manually cuz I'm too lazy to debug
            interval = setInterval(function() {
                if(parseInt(playYear) > 2014) {
                    clearInterval(interval);
                    interval = null;
                    $("#play").removeClass("active");
                    switchYear("2014");
                }
                else {
                    if(playYear !== "2014") { // so it stays 2014 in the end
                        $("#y" + playYear).removeClass("active");
                    }
                    playYear = (parseInt(playYear) + 1).toString();
                    switchYear(playYear);
                }
            }, 2100);
        }
        return false;
    });
};

var switchYear = function(year) {
    // $(".year").removeClass("active");
    $("#y" + year).addClass("active");
	currYear = year;

	if(accData && casData && year in accData && year in casData) {
		accLayer.setLatLngs(accData[currYear].map(function(row) {
		    return [row[0], row[1]];
		}));
		dmgLayer.setLatLngs(accData[currYear]);
		casLayer.setLatLngs(casData[currYear].map(function(row) {
		    return [row[0], row[1]];
		}));
		fatLayer.setLatLngs(casData[currYear].filter(function(row) { // yay for map and filter
		    return row[2];
		 }));
	}
};



/*var intervalOn = function(){
	interval = setInterval(switchYear, 3000);
	$("#play").addClass("active");
	$("#pause").removeClass("active");
};

var intervalOff = function(){
	clearInterval(interval);
	$("#play").removeClass("active");
	$("#pause").addClass("active");
};*/

$(document).ready(plot);
