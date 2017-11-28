'use strict';

import React, { Component }     from 'react';
import { Link, withRouter }           from 'react-router-dom';


const Goal = ({goal, index}) => {
    const url = `/goal/${goal.id}`;
    return <tr key={index}>
        <th><Link to={url}>{goal.title}</Link></th>
    </tr>;
};

class MyGoals extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                goals: []
            }
        }
    }

    componentDidMount() {
        $.ajax({
            url: `/v1/goals/${this.props.user.getUser().username}`,
            method: "get"
        })
            .then(data => {
                this.setState({user:data});
            })
            .fail(err => {
                let errorEl = document.getElementById('errorMsg');
                errorEl.innerHTML = `Error: ${err.error}`;
            });
    }

    render() {
        let goals = this.state.user.goals.map((goal, index) => (
            <Goal key={index} goal={goal} index={index}/>
        ));
        const user = this.props.user.getUser();
        const page_html = user.username !== '' ?
            <div>
                <div className="row">
                    <div className="col-xs-4">
                        <h4><b>My Goals:</b></h4>
                        <div className ="row">
                            <table id="goalsTable" className="col-xs-2 table">
                                <thead>
                                    <tr>
                                        <th>Goal</th>
                                    </tr>
                                </thead>
                                <tbody>{goals}</tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-xs-4">
                        <h4><b>My Current Goal:</b></h4>
                    </div>
                    <div className="col-xs-4">
                        <h4><b>My Current Goal Progress:</b></h4>
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