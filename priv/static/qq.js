var SERVER_URL = 'http://0.0.0.0:8000/';
//var SERVER_URL = 'http://sftp.42technologies.com:8000/';

var MAX_POINTS = 60;




L.mapbox.accessToken = 'pk.eyJ1IjoibjEydiIsImEiOiJzcE5NX0hzIn0.0tJfYm5rf6ln0NiTjSTPaQ';
var tileLayer = L.mapbox.tileLayer('examples.map-h67hf2ic', {});
var map = L.mapbox.map('map', null, {
	center: [37.7853855,-122.398242],
	zoom: 13
});
tileLayer.addTo(map);


function updateBoundingBox(users) {

	var offset = 0.001;
	var points = Object.keys(users).reduce(function(result, key) {
		var points = users[key].getPoints();
		var point = points[0];
		if (!point) {
			return result;
		}
		result.push([point[0], point[1]]);
		result.push([point[0], point[1]]);
		return result.concat(points.slice(1));
	}, []);

	if (points.length === 0) {
		return;
	}

	var point = points.shift();
	var bounds = L.latLngBounds(point[0], point[1]);

	points.forEach(function(point) {
		bounds.extend(point);
	});

	map.fitBounds(bounds);
}


function createUser(color) {

	var points = [];
	var markers = [];
	var lines = [];

	function fakeWatchPosition(long, lat, fn) {

		function rnd() {
			return (Math.random() - 0.5) / 1000;
		}

		return setInterval(function() {
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
		//watchID = navigator.geolocation.watchPosition(onMove, onMoveError, {enableHighAccuracy: true});
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
		removeAll();

		points.push([latitude, longitude]);
		points = points.slice(-MAX_POINTS);

		drawAll(points);
	}


	function drawAll(points) {
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
					color: color,
					weight: 1 + i/lastIndex * 5,
					opacity: q
				}).addTo(map);
				lines.push(polyline);
			}

			if (i === lastIndex) {
				var marker = L.circleMarker(point, {
					radius: 7,
					color: color,
					weight: 1,
					opacity: 1,
					fillOpacity: 1
				}).addTo(map);
				markers.push(marker);
			}

			prev = point;
		}
	}

	function getPoints() {
		return points;
	}

	return {
		addMarker: addMarker,
		removeAll: removeAll,
		drawAll: drawAll,
		getPoints: getPoints,
		fakeWatchPosition: fakeWatchPosition
	}
}


//var person = createPerson('#4294FF');
//person.addMarker(-122.40225459999999, 37.7847328, 25);



window.addEventListener("load", function() {
	setTimeout(function(){
		// Hide the address bar!
		window.scrollTo(0, 1);
	}, 0);
});
