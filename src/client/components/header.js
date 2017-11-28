'use strict';

import React, { Component }         from 'react';
import { Link, withRouter }         from 'react-router-dom';


class Header extends Component {
	constructor(props) {
		super(props);
	}
    render() {
		const img_source = '/public/images/lbw.png';
        return (
			<div className="header">
				<nav className="navbar navbar-default navbar-static-top">
					<div>
						<h2>Love is a Big World!</h2>
					</div>
					<div className="col-xs-8">
						<Link to ="#">MyFriends</Link>
						<Link to="#">MyGives</Link>
						<Link to="#">MyGoals</Link>
						<Link to="#">MyLife</Link>
					</div>
					<div className="col-xs-4 right-nav">
						<Link to="/login">Log In</Link>
					</div>
				</nav>
			</div>
        );
    }
}

export default withRouter(Header);