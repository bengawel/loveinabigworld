'use strict';

import React, { Component }     from 'react';
import { Link, withRouter }     from 'react-router-dom';


class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                primary_email: "",
            }
        }
    }

    fetchUser(username) {
        $.ajax({
            url: `/v1/user/${username}`,
            method: "get"
        })
            .then(data => {
                this.setState({ user: data });
            })
            .fail(err => {
                let errorEl = document.getElementById('errorMsg');
                errorEl.innerHTML = `Error: ${err.responseJSON.error}`;
            });
    }

    componentDidMount() {
        this.fetchUser(this.props.match.params.username);
    }

    componentWillReceiveProps(nextProps) {
        this.fetchUser(nextProps.match.params.username);
    }

    render() {
        const isUser = this.props.match.params.username === this.props.user.getUser().username;
        return <div className="row">
            <div className="center-block">
                <p id="errorMsg" className="bg-danger"/>
            </div>
            <div className="col-xs-2">
                <h4>Player Profile</h4>
                { isUser ? <Link to={`/profile/${this.props.match.params.username}/edit`}>Edit Profile</Link> : undefined }
            </div>
            <div className="col-xs-8">
                <div className="row">
                    <div className="col-xs-11">
                        <div className="col-xs-6 text-right">
                            <p><b>Username:</b></p>
                            <p><b>Real Name:</b></p>
                            <p><b>Nick Name:</b></p>
                            <p><b>City:</b></p>
                            <p><b>Email Address:</b></p>
                            <p><b>Phone Number:</b></p>
                            <p><b>Date of Birth:</b></p>
                            <p><b>Gender:</b></p>
                        </div>
                        <div className="col-xs-6">
                            <p>{this.state.user.username}</p>
                            <p>{this.state.user.real_name}</p>
                            <p>{this.state.user.nick_name}</p>
                            <p>{this.state.user.city}</p>
                            <p>{this.state.user.primary_email}</p>
                            <p>{this.state.user.phone_number}</p>
                            <p>{this.state.user.dob}</p>
                            <p>{this.state.user.gender}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default withRouter(Profile);