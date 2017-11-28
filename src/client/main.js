
"use strict";

import React, { Component } from 'react';
import { render } 			from 'react-dom';
import { BrowserRouter, Route, Redirect} from 'react-router-dom';
import Landing				from './components/landing';
import Login				from './components/login';
import Header				from './components/header';
import Register				from './components/register';
import './app.css'




class App extends Component {
	constructor(props) {
		super(props);
		this.user = new User(
			window.__PRELOADED_STATE__.username,
			window.__PRELOADED_STATE__.primary_email
		);
	}
    render() {
        return <BrowserRouter>
			<div>
				<Header user={this.user}/>
				<Route exact path="/" component={Landing}/>
				<Route path="/login" render={() => {
					return this.user.loggedIn() ?
						<Redirect to={`/profile/${this.user.username()}`}/> :
						<Login user={this.user}/>;
                }}/>
				<Route path="/register" render={() => {
                    return this.user.loggedIn() ?
						<Redirect to={`/profile/${this.user.username()}`}/> :
						<Register/>;
                }}/>
			</div>
		</BrowserRouter>;

    }
}

class User {
    constructor(username, primary_email) {
        if (username && primary_email) {
            this.data = {
                username: username,
                primary_email: primary_email
            };
        } else {
            this.data =  {
                username: "",
                primary_email: ""
            };
        }
    }

    loggedIn() {
        return this.data.username && this.data.primary_email;
    }

    username() {
        return this.data.username;
    }

    logIn(router, data) {
        // Store locally
        this.data = data;
        // Go to user profile
        router.push(`/profile/${data.username}`);
    }

    logOut(router) {
        // Remove user info
        this.data = {
            username: "",
            primary_email: ""
        };
        // Go to login page
        router.push('/login');
    }

    getUser() {
        return this.data;
    }
}


render(<App/>, document.getElementById('mainDiv'));
