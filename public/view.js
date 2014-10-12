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


//function isOwner() {
//	return location.pathname.slice(1) === userId;
//}

var App = React.createClass({
	getInitialState: function() {
		return {
			userId: '',
			roomId: '',
			mode: 'home',
			sharing: false
		}
	},
	componentDidMount: function() {
		if (location.pathname === '/') {
			var userId = xkcd_pw_gen();
			this.setState({userId: userId});
			this.setState({mode: 'home'});
			history.replaceState(null, 'Sharing is on', '/' + userId);
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
		history.replaceState(null, 'Sharing is off', '/');
	},

	startSharing: function(e) {
		e.preventDefault();
		this.setState({sharing: true, mode: 'sharing'});

		//if (location.pathname === '/') {
			// Create a new room.
			var roomId = xkcd_pw_gen();
			this.setState({roomId: roomId});

			fakeWatchPosition(-122.40225459999999, 37.7847328, this.onMove);
			//navigator.geolocation.watchPosition(this.onMove, onMoveError, {enableHighAccuracy: true});

		//} else {
			// Don't create a new room.
			// Somebody shared their location with you, you're sharing your location back.
		//}
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
