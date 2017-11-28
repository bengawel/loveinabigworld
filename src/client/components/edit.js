'use strict';

import React, { Component } from 'react';
import { withRouter }       from 'react-router';


class Edit extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(ev) {
        ev.preventDefault();
        const real_name  = document.getElementById('real_name') !== null ?
            document.getElementById('real_name').value :
            '';
        const nick_name = document.getElementById('nick_name') !== null ?
            document.getElementById('nick_name').value :
            '';
        const city = document.getElementById('city') !== null ?
            document.getElementById('city').value :
            '';
        const dob = document.getElementById('dob') !== null ?
            document.getElementById('dob').value :
            '';
        const gender = document.getElementById('gender') !== null ?
            document.getElementById('gender').value :
            '';
        const phone_number = document.getElementById('phone_number') !== null ?
            document.getElementById('phone_number').value :
            '';
        const data = {
            real_name:      real_name,
            nick_name:      nick_name,
            city:           city,
            dob:            dob,
            gender:         gender,
            phone_number:   phone_number
        };

        $.ajax({
            url: "/v1/user",
            method: 'put',
            data: data
        })
            .then(() => {
                this.props.history.push(`/profile/${this.props.match.params.username}`);
            })
            .fail(err => {
                let errorEl = document.getElementById('errorMsg');
                errorEl.innerHTML = `Error: ${err.error}`;
            });
    }

    render() {
        const isUser = this.props.match.params.username === this.props.user.getUser().username;
        const page_html = isUser ?
            <div className="row">
                <div className="col-xs-2"/>
                <div className="col-xs-8">
                    <div className="center-block">
                        <p id="errorMsg" className="bg-danger"/>
                    </div>
                    <form className="form-horizontal">
                        <div className="form-group">
                            <label className="col-sm-2 control-label" htmlFor="real_name">Real Name:</label>
                            <div className="col-sm-10">
                                <input className="form-control" id="real_name" type="text" placeholder="Real Name"/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-sm-2 control-label" htmlFor="nick_name">Nick Name:</label>
                            <div className="col-sm-10">
                                <input className="form-control" id="nick_name" type="text" placeholder="Nick Name"/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-sm-2 control-label" htmlFor="city">City:</label>
                            <div className="col-sm-10">
                                <input className="form-control" id="city" type="text" placeholder="City"/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-sm-2 control-label" htmlFor="phone_number">Phone Number:</label>
                            <div className="col-sm-10">
                                <input className="form-control" id="phone_number" type="text" placeholder="Phone Number"/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-sm-2 control-label" htmlFor="gender">Gender:</label>
                            <div className="col-sm-10">
                                <input className="form-control" id="gender" type="text" placeholder="Gender"/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-sm-2 control-label" htmlFor="dob">Date of Birth:</label>
                            <div className="col-sm-10">
                                <input className="form-control" id="dob" type="text" placeholder="Date of Birth"/>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-offset-2 col-sm-10">
                                <button onClick={this.onSubmit} className="btn btn-default">Edit</button>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="col-xs-2"/>
            </div>:
            <div>
                <h4>You must be logged in as this user to edit this profile</h4>
            </div>;
        return <div>
            {page_html}
        </div>
    };
}

export default withRouter(Edit);