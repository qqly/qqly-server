var SERVER_URL = 'http://0.0.0.0:8000/';
//var SERVER_URL = 'http://sftp.42technologies.com:8000/';

var MAX_POINTS = 30;


function push(long, lat) {
	//FIXME
}

//POST /rooms/<RoomID>
//
//userId


//var x = {
//	userId1:{longitude:1234,latitude:1234},
//	userId2:{longitude:1234,latitude:1234}
//};


L.mapbox.accessToken = 'pk.eyJ1IjoibjEydiIsImEiOiJzcE5NX0hzIn0.0tJfYm5rf6ln0NiTjSTPaQ';
var map = L.mapbox.map('map', 'examples.map-h67hf2ic');
//map.locate({setView: true, maxZoom: 16});
//map.setView([37.7847328, -122.40225459999999], 18);


var points = [];
var markers = [];
var lines = [];


addMarker(-122.40225459999999, 37.7847328, 25);



function fakeWatchPosition(long, lat, fn) {
	function rnd() {
		return (Math.random() - 0.5) / 1000;
	}

	setInterval(function() {
		fn({
			coords: {
				longitude: long,
				latitude: lat,
				accuracy: 5 + Math.random() * 30
			}
		});
		long += rnd();
		lat += rnd();
	}, 1000);
}

function onMove(position) {
	var accuracy = position.coords.accuracy;
	console.log(position.coords.latitude, position.coords.longitude);
	addMarker(position.coords.longitude, position.coords.latitude, accuracy / 2);
}

function onMoveError(err) {
	console.warn(err);
}


var watchID = 0;
if (location.search == '?fake') {
	console.info('random location');
	fakeWatchPosition(-122.40225459999999, 37.7847328, onMove);
} else {
	watchID = navigator.geolocation.watchPosition(onMove, onMoveError, {enableHighAccuracy: true});
}




function removeExceedingMarkers() {
	if (markers.length <= MAX_POINTS) {
		return;
	}

	var toRemove = markers.slice(0, markers.length - MAX_POINTS);
	var i = toRemove.length;
	while (i--) {
		var marker = toRemove[i];
		map.removeLayer(marker);
	}

	markers = markers.slice(markers.length - MAX_POINTS);
}



function removeAll() {
	markers.forEach(function(m) {
		map.removeLayer(m);
	});
	markers.length = 0;

	lines.forEach(function(l) {
		map.removeLayer(l);
	});
	lines.length = 0;
}


function addMarker(longitude, latitude, radius) {
	//removeExceedingMarkers();
	removeAll();

	//points.push({long: longitude, lat: latitude, r: radius});
	points.push([latitude, longitude]);
	points = points.slice(-MAX_POINTS);

	drawAll(points);

	//var marker = L.circle([latitude, longitude], radius, {
	//	color: 'red',
	//	weight: 2,
	//	fillColor: '#f03',
	//	fillOpacity: 0.2
	//}).addTo(map);
	//
	//if (points.length >= 2) {
	//	polyline = L.polyline(points.map(function(p) {
	//		return [p.lat, p.long];
	//	}), {color: 'red'}).addTo(map);
	//
	//	map.fitBounds(polyline.getBounds());
	//}
	//
	//markers.push(marker);
}


function drawAll(points) {

	function f(i, max) {
		if (i === max) {
			return 1;
		} else {
			return 0.9 * i / max;
		}
	}

	function p(i, max) {
		if (i === max) {
			return 0.8;
		} else {
			return 0.4 * i / max;
		}
	}


	var prev = null;
	var lastIndex = points.length - 1;
	for (var i = 0; i < points.length; i++) {
		var point = points[i];
		var q = p(i, lastIndex);

		if (prev) {
			var polyline = L.polyline([prev, point], {
				color: '#4294FF',
				weight: 2 + q * 4,
				opacity: q
			}).addTo(map);
			lines.push(polyline);
		}

		if (i === lastIndex) {
			var marker = L.circleMarker(point, {
				radius: 5,
				color: '#4294FF',
				weight: 1,
				opacity: 1,
				fillOpacity: 1
			}).addTo(map);
			markers.push(marker);
		}

		prev = point;
	}

	if (polyline) {
		map.fitBounds(polyline.getBounds());
	}
}
