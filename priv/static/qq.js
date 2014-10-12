var SERVER_URL = 'http://0.0.0.0:8000/';
//var SERVER_URL = 'http://sftp.42technologies.com:8000/';

var MAX_POINTS = 60;


L.mapbox.accessToken = 'pk.eyJ1IjoibjEydiIsImEiOiJzcE5NX0hzIn0.0tJfYm5rf6ln0NiTjSTPaQ';
var map = L.mapbox.map('map', 'examples.map-h67hf2ic');


function createPerson(color) {

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


		var bounds = null;
		var i = points.length;
		while (i--) {
			var point = points[i];
			if (bounds) {
				bounds.extend(point);
			} else {
				var offset = 0.001;
				bounds = L.latLngBounds(
					[point[0] - offset, point[1] - offset],
					[point[0] + offset, point[1] + offset]
				);
			}
		}

		if (bounds) {
			map.fitBounds(bounds);
		}
	}

	return {
		addMarker: addMarker,
		removeAll: removeAll,
		drawAll: drawAll,
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
