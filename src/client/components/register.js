'use strict';

import React, { Component }     from 'react';
import { withRouter }           from 'react-router';


class Register extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    static validPassword(password) {
        if (!password || password.length < 8) {
            return { error: 'password length must be > 7' };
        }
        else if (!password.match(/[0-9]/i)) {
            return { error: 'password must contain a number' };
        }
        else if (!password.match(/[a-z]/)) {
            return { error: 'password a lowercase letter' };
        }
        else if (!password.match(/\@|\!|\#|\$|\%|\^/i)) {
            return { error: 'password must contain @, !, #, $, % or ^' };
        }
        else if (!password.match(/[A-Z]/)) {
            return { error: 'password an uppercase letter' };
        }
        return undefined;
    }

    onSubmit(ev) {
        ev.preventDefault();
        const data = {
            username:       document.getElementById('username').value,
            real_name:     document.getElementById('real_name').value,
            nick_name:      document.getElementById('nick_name').value,
            city:           document.getElementById('city').value,
            primary_email:  document.getElementById('primary_email').value,
            password:       document.getElementById('password').value,
            dob:            document.getElementById('dob').value,
            gender:         document.getElementById('gender').value,
            phone_number:   document.getElementById('phone_number').value
        };
        let $error = $('#errorMsg');
        let pwdInvalid = Register.validPassword(data.password);
        if (!data.username || data.username.length > 16 || data.username.length < 6 || !data.username.match(/^[a-z0-9]+$/i)) {
            $error.html('Error: malformed username');
        } else if (pwdInvalid) {
            $error.html(`Error: ${pwdInvalid.error}`);
        } else $.ajax({
            url: "/v1/user",
            method: "post",
            data: data
        })
            .then(() => {
                this.props.history.push('/login');
            })
            .fail(err => {
                let errorEl = document.getElementById('errorMsg');
                errorEl.innerHTML = `Error: ${err.responseJSON.error}`;
            });
    }

    render() {
        return <div className="row">
            <div className="col-xs-2"/>
            <div className="col-xs-8">
                <div className="center-block">
                    <p id="errorMsg" className="bg-danger"/>
                </div>
                <form className="form-horizontal">
                    <div className="form-group">
                        <label className="col-sm-2 control-label" htmlFor="username">Username:</label>
                        <div className="col-sm-10">
                            <input className="form-control" id="username" type="text" placeholder="Username"/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label" htmlFor="password">Password:</label>
                        <div className="col-sm-10">
                            <input className="form-control" id="password" type="password" placeholder="Password"/>
                        </div>
                    </div>
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
                        <label className="col-sm-2 control-label" htmlFor="primary_email">Email:</label>
                        <div className="col-sm-10">
                            <input className="form-control" id="primary_email" type="email" placeholder="Email Address"/>
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
                            <button onClick={this.onSubmit} className="btn btn-default">Register</button>
                        </div>
                    </div>
                </form>
            </div>
            <div className="col-xs-2"/>
        </div>
    };

}

export default withRouter(Register);