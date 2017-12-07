'use strict';

import React, { Component }     from 'react';
import { Link, withRouter }           from 'react-router-dom';

class MyGoal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goal: {
                title: '',
                tasks: []
            }
        };
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(ev) {
        ev.preventDefault();
        $.ajax({
            url: `/v1/goals/current/${this.props.match.params.goalid}`,
            method: 'put'
        }).then(() => {
            this.props.history.push('/mygoals');
        }).fail(err => {
            console.log(err);
        })
    }

    componentDidMount() {
        $.ajax({
            url:`/v1/goals/mygoal/${this.props.match.params.goalid}`,
            method: 'get'
        }).then(data => {
            this.setState({goal: data.goal});
            console.log(data.goal.tasks);
            console.log(this.state.goal.tasks);

        }).fail(err => {
            console.log(err);
        })
    }

    render() {

        return <div>
            <div className="row">
                <div className="col-xs-1">
                    <h4><b>{this.state.goal.title}</b></h4>
                </div>
                <div className="col-xs-1">
                    <button onClick={this.onSubmit} className="btn btn-default">Make Current Goal</button>
                </div>
            </div>
            <div className="row">
                <div className="col-xs-6">
                    <h4><b>Tasks:</b></h4>
                </div>
            </div>
            <div className="row">
                <div className="col-xs-2"/>
                <div className="col-xs-3">

                </div>
            </div>
        </div>
    }
}

export default withRouter(MyGoal);