'use strict';

import React, { Component }         from 'react';
import { Link, withRouter }         from 'react-router-dom';


class Header extends Component {
	constructor(props) {
		super(props);
	}
    render() {
		const user = this.props.user.getUser();
		const profile_link = `/profile/${user.username}`;
		const right = user.username !== '' ?
			<div className="header">
				<Link to="/logout">Log Out</Link>
			</div>:
			<div className="col-xs-4 right-nav">
				<Link to="/login">Log In</Link>
				<Link to="/register">Register</Link>
			</div>;
		const left = user.username!== '' ?
			<div>
				<Link to ={profile_link}>MyProfile</Link>
				<Link to ="#">MyFriends</Link>
				<Link to="#">MyGives</Link>
				<Link to="/mygoals">MyGoals</Link>
				<Link to="/mylife">MyLife</Link>
			</div>:
			<div></div>;
        return (
			<div className="header">
				<nav className="navbar navbar-default navbar-static-top">
					<div>
						<h2>Love is a Big World!</h2>
					</div>
					<div className="col-xs-8">
						{left}
					</div>
					{right}
				</nav>
			</div>
        );
    }
}

export default withRouter(Header);