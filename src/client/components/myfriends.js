'use strict';

import React, { Component }     	from 'react';
import { Link, withRouter }         from 'react-router-dom';

const Status = ({stat, index, par}) => {
    const url = `/statuses/${stat.id}`;
	const tblcontent = [
		<div className="panel-heading"><h4 className="panel-title"><b>{stat.title}</b></h4>
		<h6 className="panel-title">{stat.user}</h6></div>,
		<div className="panel-body">{stat.content}</div>];
	stat.comments.forEach(function(commnt) {
		tblcontent.push(<div className="panel panel-info">
			<div className="panel-heading"><b>{commnt.username}</b></div>
			<div className="panel-body">{commnt.comm}</div>
		</div>);
	});
	tblcontent.push(<div className="row">
		<div className="col-xs-4"><input className="form-control" id={stat._id} type="text"/></div>
		<div className="col-xs-4"><button className="btn btn-info" onClick={(evt) => par.addComment(stat, evt)}>Add Comment</button></div>
	</div>);
    return <div className="panel panel-primary" key={index}>{tblcontent}</div>;
};

class MyFriends extends Component {
    constructor(props) {
        super(props);
        this.state = { statuses: {} };
		
		this.createStatus = this.createStatus.bind(this);
		this.addComment = this.addComment.bind(this);
		//this.getPost = this.getPost.bind(this);
    }
	
	addComment(c, e) {
		e.preventDefault();
		const data = {
            usrn:     	 this.props.user.getUser().username,
            cont:	     document.getElementById(c._id).value,
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
				
				// empty input boxes
				document.getElementById(c._id).value = "";
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
	/* getPost() {
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
	} */
	
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
		//stat_list.reverse(); // for "most recent" ordering
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
				<p id="errorMsg" className="bg-danger"/>
				<div className="row">
					<div className="col-xs-12">
						<h4><b>Feed:</b></h4>
					</div>
				</div>
				{stat_list}
            </div>:
            <div>Log in to view this information</div>;
        return <div>
            {page_html}
        </div>
    };
}

export default withRouter(MyFriends);