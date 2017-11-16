'use strict';

import React, { Component }         from 'react';
import { Link, withRouter }         from 'react-router-dom';


class Header extends Component {
    render() {
        return (
			<div className="header">
				<div>
					<img src='/public/images/lbw.png' alt={"lbw"} />
				</div>
				<nav>
					<div className="navbar">
						<div className="navDiv">
							<Link to ="#">MyFriends</Link>
							<Link to="#">MyGives</Link>
							<Link to="#">MyGoals</Link>
							<Link to="#">MyLife</Link>
						</div>
					</div>
				</nav>
			</div>
        );
    }
}

export default withRouter(Header);