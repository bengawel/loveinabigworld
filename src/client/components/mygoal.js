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
        this.taskClick = this.taskClick.bind(this);
        this.completeTask = this.completeTask.bind(this);
        this.cancelClick = this.cancelClick.bind(this);
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

    taskClick(ev) {
        ev.preventDefault();
        let target = ev.target.id;
        document.getElementsByClassName(target)[0].hidden="";

    }

    completeTask(ev) {
        ev.preventDefault();
        let taskid = ev.target.parentNode.classList.value;
        $.ajax({
            url: `/v1/goals/mygoal/${this.props.match.params.goalid}/${taskid}`,
            method: 'put',
            data: taskid
        }).then(() => {
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
        }).fail(err => {
            console.log(err);
        })
    }

    cancelClick(ev) {
        ev.preventDefault();
        let target = ev.target;
        document.getElementById(target.parentNode.id).hidden="hidden";
    }

    render() {
        let numOfCompletedTasks = 0;
        let tasks = this.state.goal.tasks.map((task, index) => {
            if (task.completed) {
                numOfCompletedTasks = numOfCompletedTasks + 1;
                return <div key={index}/>;
            } else {
                return <div key={index} className="col-xs-8">
                    <li className="taskList" id={task.description} onClick={this.taskClick}>{task.description}</li>
                    <div id={task.description + index} className={task.description} hidden="hidden">
                        <button onClick={this.completeTask} className="btn btn-default task">Complete Task</button>
                        <button onClick={this.cancelClick} className="btn btn-default task">Cancel</button>
                    </div>
                </div>
            }
        });
        if (numOfCompletedTasks === 3) {
            tasks = <div><p>You have completed all your tasks!</p></div>
        }

        return <div>
            <div className="row">
                <div className="col-xs-4">
                    <h4><b>{this.state.goal.title}</b></h4>
                </div>
                <div className="col-xs-1">
                    <button onClick={this.onSubmit} className="btn btn-default">Make Current Goal</button>
                </div>
            </div>
            <div className="row">
                <div className="col-xs-6">
                    <h4><b>Tasks:</b></h4>
                    <ul>
                        {tasks}
                    </ul>
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