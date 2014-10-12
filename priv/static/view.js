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
			receivingId: 0,

			users: {}
		}
	},
	componentDidMount: function() {
		var userId = xkcd_pw_gen();

		if (getRoomId() === '') {
			var roomId = xkcd_pw_gen();
			this.setState({mode: 'home'});
			setRoomId(roomId);
		} else {
			roomId = getRoomId();
		}

		var users = {};
		users[userId] = createUser('#4294FF');

		this.setState({roomId: roomId, userId: userId, users: users});
		this.startReceiving();
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
		var person = this.state.users[this.state.userId];
		var watchId = person.fakeWatchPosition(-122.40225459999999, 37.7847328, this.onMove);
		this.setState({watchId: watchId});
	},

	startReceiving: function() {

		var receivingId = setInterval(function() {
			$.get('http://qqly.herokuapp.com/api/rooms/' + this.state.roomId, function(data, e) {

				data = data.length === 0? {} : data;
				data = Object.keys(data).reduce(function(result, key) {
					var d = data[key];
					var lat = parseFloat(d[0]), long = parseFloat(d[1]);
					result[key] = {longitude:long, latitude:lat};
					return result;
				}, {});
				console.log('DATA', e, JSON.stringify(data, null, 2));
				this.updateMapState(data);
			}.bind(this));
		}.bind(this), 1000);

		this.setState({receivingId: receivingId});
	},


	updateUser: function(userId, position) {
		var user = this.state.users[userId];

		if (!user) {
			user = createUser('#DEADBE');
			this.state.users[userId] = user;
		}

		var latestPoint = user.getPoints().slice(-1)[0];

		if (latestPoint) {

			function floatEquals(a, b, threshold) {
				return Math.abs(a - b) <= threshold;
			}

			latestPoint = {
				latitude: latestPoint[0],
				longitude: latestPoint[1]
			};

			if (floatEquals(latestPoint.latitude, position.latitude, 0) &&
			    floatEquals(latestPoint.longitude, position.longitude, 0)) {
				console.log("[" + userId + "] position is the same, not updating.");
				console.log("latest saved:", latestPoint);
				console.log("new position:", position);
				return;
			}
		}

		user.addMarker(position.longitude, position.latitude, 25); //fixme
	},


	updateMapState: function(userPositions) {
		var state = this.state;
		var userIds = Object.keys(userPositions);

		userIds.forEach((function(userId) {
			this.updateUser(userId, userPositions[userId]);
		}).bind(this));
		this.forceUpdate();

		updateBoundingBox(this.state.users);
	},

	onMove: function onMove(position) {
		console.info('onMove', position);

		var state = this.state;

		var accuracy = position.coords.accuracy;
		console.log(position.coords.latitude, position.coords.longitude);

		API.post(state.roomId, state.userId, position.coords.latitude, position.coords.longitude);
	}
});


React.renderComponent(
	<App/>,
	document.getElementById('controls')
);
