function newId() {
	var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split('');
	var newId = [];
	var i = 0;
	var radix = chars.length;
	var len = 12;

	for (i = 0; i < len; i++) newId[i] = chars[0 | Math.random()*radix];

	return newId.join('');
}


//var state = 'dunno';
//
//function setState(newState) {
//	if (newState === state) {
//		return;
//	}
//	state = newState;
//
//	switch(state) {
//		case 'home':
//
//			break;
//	}
//}
//
//
//if (location.pathname === '/') {
//	setState('home');
//
//} else {
//
//}



var SERVER_URL = 'http://0.0.0.0:8000/';
//var SERVER_URL = 'http://sftp.42technologies.com:8000/';

function guidGenerator() {
	function s4() {
		return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	}
	return (s4()+s4()+"-"+s4()+"-"+s4()+"-"+s4()+"-"+s4()+s4()+s4());
}

var userId = guidGenerator();
var roomId = 0;
var iframe = null;


function start() {
	iframe = document.getElementById('iframe');
	if (!iframe) {
		iframe = document.createElement('iframe');
		iframe.id = 'iframe';
		document.body.appendChild(iframe);
	} else {
		// disconnect
	}
	roomId = guidGenerator();
	//iframe.src = SERVER_URL + 'start?roomId=' + roomId + '&userId=' + userId;
}

function push(long, lat) {


	if (!iframe) {
		throw new Error('Cannot push, not iframe found. Need to start() first.');
	}
	iframe.src = SERVER_URL + 'push?roomId=' + roomId + '&userId=' + userId + '&long=' + long + '&lat=' + lat;
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
map.setView([37.7847328, -122.40225459999999], 18);

// Build a marker from a simple GeoJSON object:
var marker = L.mapbox.featureLayer({
	type: 'Feature',
	geometry: {
		type: 'Point',
		coordinates: [-122.40225459999999, 37.7847328]
	},
	properties: {
		title: 'Hello world!',
		'marker-color': '#f86767'
	}
}).addTo(map);

// Iterate over the featureLayer we've called "marker"
// and open its popup instead of clicking to trigger it.
marker.eachLayer(function(m) {
	m.openPopup();
});


var watchID = navigator.geolocation.watchPosition(function(position) {
	console.log(position.coords.latitude, position.coords.longitude);
	addMarker(position.coords.longitude, position.coords.latitude);
}, function onError(er) {
	console.log(er);
}, {
	enableHighAccuracy: true
});


function addMarker(longitude, latitude) {
	marker = L.mapbox.featureLayer({
		type: 'Feature',
		geometry: {
			type: 'Point',
			coordinates: [longitude, latitude]
		},
		properties: {
			title: 'Hello world!',
			'marker-color': '#ff6733'
		}
	}).addTo(map);
}
