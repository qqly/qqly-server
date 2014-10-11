/**
 * @jsx React.DOM
 */

//function isOwner() {
//	return location.pathname.slice(1) === userId;
//}

var App = React.createClass({
	getInitialState: function() {
		return {
			userId: '',
			mode: 'home',
			sharing: false
		}
	},
	componentDidMount: function() {
		if (location.pathname === '/') {
			this.setState({mode: 'home'})
		} else {
			this.setState({mode: 'room'})
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

		if (location.pathname === '/') {
			// Create a new room.
			var userId = xkcd_pw_gen();
			history.replaceState(null, 'Sharing is on', '/' + userId);
			this.setState({userId: userId});
		} else {
			// Don't create a new room.
			// Somebody shared their location with you, you're sharing your location back.
		}
	}
});


React.renderComponent(
	<App/>,
	document.getElementById('controls')
);
