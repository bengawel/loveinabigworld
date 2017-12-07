'use strict';

import React, { Component }     from 'react';
import { Link, withRouter }           from 'react-router-dom';


const Goal = ({goal, index}) => {
    const url = `/goal/${goal._id}`;
    return <tr key={index}>
        <th><Link to={url}>{goal.title}</Link></th>
    </tr>;
};

class MyGoals extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goals: [],
            current_goal: ''
        }
    }

    componentDidMount() {
        $.ajax({
            url: `/v1/goals/${this.props.user.getUser().username}`,
            method: "get"
        })
            .then(data => {
                this.setState({goals:data.goals});
                let current_state;
                data.goals.forEach(function(goal) {
                    if (goal.current === true) {
                        current_state = {current_goal: goal};
                    }
                });
                if (current_state !== undefined) {
                    this.setState(current_state);
                }
            })
            .fail(err => {
                let errorEl = document.getElementById('errorMsg');
                errorEl.innerHTML = `${err.responseJSON.error}`;
            });
    }

    render() {
        let numOfCompletedTasks = 0;
        if (this.state.current_goal !== ''){
            this.state.current_goal.tasks.forEach(function(task) {
                if (task.completed) {
                    numOfCompletedTasks = numOfCompletedTasks + 1;
                }
            });
        }
        let goalProgress = <div>
            <p>You have completed {numOfCompletedTasks} out of 3 tasks!</p>
        </div>;
        let goals = this.state.goals.map((goal, index) => (
            <Goal key={index} goal={goal} index={index}/>
        ));
        const url = `/goal/${this.state.current_goal._id}`;
        const user = this.props.user.getUser();
        const page_html = user.username !== '' ?
            <div>
                <Link to="/goal">Create new goal!</Link>
                <div className="row">
                    <div className="center-block">
                        <p id="errorMsg" className="bg-danger"/>
                    </div>
                    <div className="col-xs-3">
                        <h4><b>My Goals:</b></h4>
                        <div className ="row">
                            <table id="goalsTable" className="col-xs-1 table">
                                <tbody>{goals}</tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-xs-1"/>
                    <div className="col-xs-4">
                        <h4><b>My Current Goal:</b></h4>
                        <div className="row">
                            <div className="col-xs-2">
                                <Link to={url}>{this.state.current_goal.title}</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-4">
                        <h4><b>My Current Goal Progress:</b></h4>
                        <div className="row">
                            {goalProgress}
                        </div>
                    </div>
                </div>
            </div>:
            <div>Log in to view this information</div>;
        return <div>
            {page_html}
        </div>
    };
}

export default withRouter(MyGoals);