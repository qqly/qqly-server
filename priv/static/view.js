/**
 * @jsx React.DOM
 */


var API = {
	post: function(roomId, userId, latitude, longitude) {
		$.ajax('http://qqly.herokuapp.com/api/rooms/' + roomId + '/users/' + userId, {
			type: 'POST',
			data: {
				latitude: latitude,
				longitude: longitude
			}
		});
	}
};


function setRoomId(state) {
	location.hash = state;
	//history.replaceState(null, 'Blah', '/' + state);
}

function getRoomId() {
	return location.hash.replace(/^\#/, '');
}

//function isOwner() {
//	return location.pathname.slice(1) === userId;
//}

var App = React.createClass({
	getInitialState: function() {
		return {
			userId: '',
			roomId: '',
			mode: 'home',
			sharing: false,
			watchId: 0,
			receivingId: 0
		}
	},
	componentDidMount: function() {
		if (getRoomId() === '') {
			var userId = xkcd_pw_gen();
			var roomId = xkcd_pw_gen();
			this.setState({userId: userId, roomId: roomId});
			this.setState({mode: 'home'});
			setRoomId(roomId);
		} else {
			this.setState({roomId: getRoomId()});
			this.startReceiving();
		}
	},

	render: function() {
		var mode = this.state.mode;
		if (mode === 'home') {
			return <a className='button button-start' onClick={this.startSharing}>Share my location</a>;
		} else {
			return <div>
				<a className='button button-stop' onClick={this.stopSharing} href='/'>Stop sharing</a>
			</div>;
		}
		return <div>Dunno</div>;
	},

	stopSharing: function(e) {
		e.preventDefault();
		this.setState({sharing: false, mode: 'home'});

		if (this.state.watchId) {
			clearInterval(this.state.watchId);
		}

		setRoomId('');
	},

	startSharing: function(e) {
		e.preventDefault();
		this.setState({sharing: true, mode: 'sharing'});

		//if (location.pathname === '/') {
			// Create a new room.
			this.setState({watchId: fakeWatchPosition(-122.40225459999999, 37.7847328, this.onMove)});
			//navigator.geolocation.watchPosition(this.onMove, onMoveError, {enableHighAccuracy: true});

		//} else {
			// Don't create a new room.
			// Somebody shared their location with you, you're sharing your location back.
		//}
	},

	startReceiving: function() {
		var receivingId = setInterval(function() {
			$.get('http://qqly.herokuapp.com/api/rooms/' + this.state.roomId, function(e, data) {
				console.log('DATA', e, data);
			});
		}.bind(this), 1000);

		this.setState({receivingId: receivingId});
	},

	onMove: function onMove(position) {
		var state = this.state;

		var accuracy = position.coords.accuracy;
		console.log(position.coords.latitude, position.coords.longitude);

		addMarker(position.coords.longitude, position.coords.latitude, accuracy / 2);
		API.post(state.roomId, state.userId, position.coords.latitude, position.coords.longitude);
	}
});


React.renderComponent(
	<App/>,
	document.getElementById('controls')
);
