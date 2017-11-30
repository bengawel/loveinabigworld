'use strict';

import React, { Component }     from 'react';
import { withRouter }           from 'react-router';

class Goal extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(ev) {
        ev.preventDefault();
        const taskList = [{description: document.getElementById('task_one').value, completed: false}, {description: document.getElementById('task_two').value, completed: false},
            {description: document.getElementById('task_three').value, completed: false}];
        const data = {
            title:      document.getElementById('title').value,
            tasks:      taskList,
            current:    false
        };
        $.ajax({
            url: "/v1/goals",
            method: "post",
            data: data
        })
            .then(() => {
                this.props.history.push('/mygoals');
            })
            .fail(err => {
                let errorEl = document.getElementById('errorMsg');
                errorEl.innerHTML = `Error: ${err.responseJSON.error}`;
            });
    }

    render() {
        return <div>
            <div className="row">
                <div className="col-xs-2"/>
                <div className="col-xs-8">
                    <div className="center-block">
                        <p id="errorMsg" className="bg-danger"/>
                    </div>
                    <h4>Create New Goal</h4>
                    <form className="form-horizontal">
                        <div className="form-group">
                            <label className="col-sm-2 control-label" htmlFor="title">Goal Title:</label>
                            <div className="col-sm-10">
                                <input className="form-control" id="title" type="text" placeholder="Title"/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-sm-2 control-label" htmlFor="task_one">Task One:</label>
                            <div className="col-sm-10">
                                <input className="form-control" id="task_one" type="text" placeholder="Task One"/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-sm-2 control-label" htmlFor="task_two">Task Two:</label>
                            <div className="col-sm-10">
                                <input className="form-control" id="task_two" type="text" placeholder="Task Two"/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-sm-2 control-label" htmlFor="task_three">Task Three:</label>
                            <div className="col-sm-10">
                                <input className="form-control" id="task_three" type="text" placeholder="Task Three"/>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-offset-2 col-sm-10">
                                <button onClick={this.onSubmit} className="btn btn-default">Create Goal</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    }
}

export default withRouter(Goal);