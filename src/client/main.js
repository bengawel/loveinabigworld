"use strict";

import React, { Component } from 'react';
import { render } from 'react-dom';

class App extends Component {
    render () {
        return <p> Love is a Big World Demo </p>;
    }
}

render(<App/>, document.getElementById('mainDiv'));