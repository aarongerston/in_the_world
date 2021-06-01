

// ACCESS TOKENS
var mapboxAPIKey = 'pk.eyJ1IjoiYWFyb25nZXJzdG9uIiwiYSI6ImNrbjd6OWZkNTBjeDUydm1xOXl4MHlrb3IifQ.8mTlU2YHG9BhMw1iMIXeKg'
var GoogleAPIKey = 'AIzaSyA-P-iBKYhcqTAkXk8FtvYK7SC7LUwUbCQ'
var GoogleProjectKey = 'b09db30cf2fd150ff'

// Map setup position, zoom level, etc.
var startLoc = [33, 0]
var map = new L.Map('map', {zoomSnap: 0.05, zoomDelta: 0.05, cursor: true, worldCopyJump: true}).setView(startLoc, desiredZoom);
function positionLocated(pos) {
	map.panTo(new L.LatLng(pos.coords.latitude, pos.coords.longitude))
	console.log('Position found! ' + pos.coords);
}

// Make map
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAPIKey, {
	maxZoom: 18,
	id: 'mapbox/satellite-v9',
	tileSize: 512,
	zoomOffset: -1
}).addTo(map);

// Add country labels
map.createPane('labels');
var positronLabels = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
	pane: 'labels'
}).addTo(map);

// json overlay settings
function polystyle(feature) {
	// if (isMobile) {
		return {
			fillOpacity: 0,
			color: 'black', // outline color
			opacity: 0.2,
			weight: 1
		}
	// } else {
	// 	return {

	// 		// fill
	// 		fillColor: 'white',
	// 		fillOpacity: 0,

	// 		// outline
	// 		color: 'black',  //Outline color
	// 		opacity: 0,
	// 		weight: 2
	// 	}
	// }
}

// Overlay worldmap json
geojson = L.geoJson(worldmap, {style: polystyle, onEachFeature: onEachFeature}).addTo(map);

// declare global variables
var country = '';
scope = document.getElementById('scopeSelect').value
question = document.getElementById('questionText').value
var resultsDict = {};
popupText = '';

// On-hover popup with country name
popupMaxWidth = function() {
	console.log(docWidth);
	console.log(isMobile());
	if (isMobile()) {
		console.log(docWidth*0.9);
		return docWidth*0.9
	} else {
		console.log(docWidth*2/3);
		return docWidth*2/3
	}
}
var hoverPopup = L.popup({className: 'country-popup', autoPan: true, closeButton: false, closeOnClick: false, maxWidth: popupMaxWidth(), autoClose: false});
geojson.eachLayer(function (layer) {

	// Keep country name over cursor
	layer.bindPopup(hoverPopup);
	layer.on('mouseover', function (e) {
		hoverPopup.setLatLng(e.latlng)
		hoverPopup.openOn(map);
	});
	layer.on('mouseout', function(e) {
		e.target.closePopup(hoverPopup);
	});
	// update popup location
	layer.on('mousemove', function (e) {
		hoverPopup.setContent(country)
		hoverPopup.setLatLng(e.latlng)
		hoverPopup.openOn(map);
	});
});


// control that shows state info on hover
var info = L.control();

info.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'info');
	this.update({});
	return this._div;
};

info.update = function ({infoCountry = scope, text = 'Click to find out'}) {
	info._div.innerHTML = '<h4>' + question.charAt(0).toUpperCase() + question.slice(1) + ' in ' + '<span style="color: black">' + infoCountry + '</span>?</h4><br />' + text
};

info.addTo(map);


function getPopupText() {
	if (country in resultsDict) {
		return parseGoogleResults(resultsDict[country])
	} else {
		return country
	}
} 


function highlightFeature(e) {
	country = e.target.feature.properties.name;
	console.log(country);
	var layer = e.target;

	layer.setStyle({
		dashArray: '',

		// fill
		fillColor: 'black',
		fillOpacity: 0.6,

		// outline
		color: 'red',
		opacity: 0.4,
		weight: 3
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}

	info.update({infoCountry: country});
}

function resetHighlight(e) {
	geojson.resetStyle(e.target);
	info.update({infocountry: country});
}

function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: countryClick,
	});
}

// Attributions
map.attributionControl.addAttribution('<b>Website and concept by <a href="https://www.linkedin.com/in/aarongerston">Aaron Gerston</a></b>, made possible by' +
										' &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' + 
										' &copy; <a href="https://carto.com/attribution">CARTO</a>' + 
										' &copy; <a href="https://www.mapbox.com/">Mapbox</a>')