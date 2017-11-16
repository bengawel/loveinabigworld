"use strict";

import React, { Component } from 'react';
import { render } from 'react-dom';
import './app.css'
import lbw from './lbw.png'

class App extends Component {
	render() {
		return(
			<div class="page">
				<Header/>
				<Content/>
			</div>
		);
	}
}

class Header extends React.Component {
   render() {
      return (
		<div class="header">
			 <div>
				<img src={lbw} alt={"lbw"} />
			 </div>
			 <nav>
				<div class="navbar">
					<div class="navDiv">
						<a href="#">MyFriends</a>
						<a href="#">MyGives</a>
						<a href="#">MyGoals</a>
						<a href="#">MyLife</a>
					</div>
				</div>
			 </nav>
		</div>
      );
   }
}

class Content extends React.Component {
   render() {
      return (
         <div>
            <h2>Content</h2>
            <p> stuff goes here </p>
         </div>
      );
   }
}

render(<App/>, document.getElementById('mainDiv'));