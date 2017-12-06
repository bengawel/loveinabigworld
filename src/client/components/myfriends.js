'use strict';

import React, { Component }     	from 'react';
import { Link, withRouter }         from 'react-router-dom';

const Status = ({stat, index, par}) => {
    const url = `/statuses/${stat.id}`;
	const tblcontent = [<tr key={index}>
		<th>{stat.title}</th>
		<th>{stat.user}</th>
		<th><a onClick={(evt) => par.addComment(stat, evt)}>add a comment</a></th>
	</tr>, <tr><th/><th><p>{stat.content}</p></th></tr>];
	stat.comments.forEach(function(commnt) {
		tblcontent.push(<tr><th/><th>{commnt.username}</th><th><p>{commnt.comm}</p></th></tr>);
	});
    return <tbody>{tblcontent}</tbody>;
};

class MyFriends extends Component {
    constructor(props) {
        super(props);
        this.state = { statuses: {} };
		
		//this.updateDisplay = this.updateDisplay.bind(this);
		this.createStatus = this.createStatus.bind(this);
		this.addComment = this.addComment.bind(this);
		this.getPost = this.getPost.bind(this);
    }

	/*updateDisplay(c, e) {
		e.preventDefault();
		let statusEl = document.getElementById('currStatus');
        statusEl.innerHTML = "Title: " + c.title;
		let authEl = document.getElementById('currAuth');
        authEl.innerHTML = "Author: " + c.user;
		let textEl = document.getElementById('currContent');
        textEl.innerHTML = c.content;
	}*/
	
	addComment(c, e) {
		e.preventDefault();
		const data = {
            usrn:     	 this.props.user.getUser().username,
            cont:	     document.getElementById('content').value,
        };
		let $error = $('#errorMsg');
        $.ajax({
            url: `/v1/comment/${c._id}`,
            method: "post",
            data: data
        })
            .then(data => {
                console.log("commented");
				
				var repl = this.state.statuses;
				repl[this.state.statuses.indexOf(c)] = data.statuses;
				this.setState({statuses: repl}); // update w response
				
				document.getElementById('title').value = "";	// empty input boxes
				document.getElementById('content').value = "";
				console.log(this.state.statuses);
            })
            .fail(err => {
                let errorEl = document.getElementById('errorMsg');
                errorEl.innerHTML = `Error: ${err.error}`;
            });
	}
		
	createStatus() {
        const data = {
            title:       document.getElementById('title').value,
            user:     	 this.props.user.getUser().username,
            content:     document.getElementById('content').value,
			comments:	 []
        };
        let $error = $('#errorMsg');
        $.ajax({
            url: `/v1/statuses`,
            method: "post",
            data: data
        })
            .then(data => {
                //console.log("posted");
				this.setState({statuses: this.state.statuses.concat([data.statuses])}); // update w response
				document.getElementById('title').value = "";	// empty input boxes
				document.getElementById('content').value = "";
            })
            .fail(err => {
                let errorEl = document.getElementById('errorMsg');
                errorEl.innerHTML = `Error: ${err.responseJSON.error}`;
            });
    }
	
	// DEBUG
	getPost() {
		$.ajax({
            url: `/v1/posts`,
            method: "get"
        })
            .then(data => {
                //this.setState({posts: data.posts});
				// debug
				console.log("got sts");
				console.log(data.statuses);
				console.log(this.state.statuses);
            })
            .fail(err => {
				console.log("?");
                let errorEl = document.getElementById('errorMsg');
                errorEl.innerHTML = `Error: ${err.error}`;
            });
	}
	
     componentDidMount() {
        $.ajax({
            url: `/v1/statuses`,
            method: "get"
        })
            .then(data => {
                this.setState({statuses: data.statuses});

            })
            .fail(err => {
                let errorEl = document.getElementById('errorMsg');
                errorEl.innerHTML = `Error: ${err.error}`;
            });
    }

    render() {
		let stat_list = this.state.statuses.length > 0 ? 
			this.state.statuses.map((stat, index) => (<Status key={index} stat={stat} index={index} par={this}/>)):
			[];
        const user = this.props.user.getUser();
        const page_html = user.username !== '' ?
            <div>
				<div className="form-group">
					<label>Status Title</label>
					<input className="form-control" id="title" type="text"/>
				</div>
				<div className="form-group">
					<label>Status Content</label>
					<textarea className="form-control" id="content" rows="3"></textarea>
				</div>
				<button className="btn btn-primary" onClick={this.createStatus}>Post!</button>
				<button onClick={this.getPost}>debug</button>
				<p id="errorMsg" className="bg-danger"/>
				<div className="row">
					<div className="col-xs-12">
						<h4><b>Feed:</b></h4>
						<div className ="row">
							<table id="postsTable" className="col-xs-2 table">
								{stat_list}
							</table>
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

export default withRouter(MyFriends);