
"use strict";

import React, { Component } from 'react';
import { render } 			from 'react-dom';
import { BrowserRouter, Route, Redirect} from 'react-router-dom';
import Landing				from './components/landing';
import './app.css'




class App extends Component {
    render() {
        return <BrowserRouter>
			<div>
				<Route exact path="/" component={Landing}/>
			</div>
		</BrowserRouter>;

    }
}

render(<App/>, document.getElementById('mainDiv'));
