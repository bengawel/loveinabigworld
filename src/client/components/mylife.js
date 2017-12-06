'use strict';

import React, { Component }     from 'react';
import { Link, withRouter }           from 'react-router-dom';

const Post = ({post, index, par}) => {
    const url = `/post/${post.id}`;
    return <tr key={index}>
        <th><a onClick={(evt) => par.updateDisplay(post, evt)}>{post.title}</a></th>
		<th>{post.user}</th>
    </tr>;
};

class MyLife extends Component {
    constructor(props) {
        super(props);
        this.state = { posts: {} };
		
		this.updateDisplay = this.updateDisplay.bind(this);
		this.createPost = this.createPost.bind(this);
		//this.getPost = this.getPost.bind(this);
    }

	updateDisplay(c, e) {
		e.preventDefault();
		let postEl = document.getElementById('currPost');
        postEl.innerHTML = "Title: " + c.title;
		let authEl = document.getElementById('currAuth');
        authEl.innerHTML = "Author: " + c.user;
		let textEl = document.getElementById('currContent');
        textEl.innerHTML = c.content;
	}
		
	createPost() {
        const data = {
            title:       document.getElementById('title').value,
            user:     	 this.props.user.getUser().username,
            content:     document.getElementById('content').value
        };
        let $error = $('#errorMsg');
        $.ajax({
            url: `/v1/posts`,
            method: "post",
            data: data
        })
            .then(data => {
                //console.log("posted");
				this.setState({posts: this.state.posts.concat([data.post])}); // update w response
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
                this.setState({posts: data.posts});
				// debug
				console.log("got posts");
				console.log(data.posts);
				console.log(this.state.posts);
            })
            .fail(err => {
				console.log("?");
                let errorEl = document.getElementById('errorMsg');
                errorEl.innerHTML = `Error: ${err.error}`;
            });
	} */
	
     componentDidMount() {
        $.ajax({
            url: `/v1/posts`,
            method: "get"
        })
            .then(data => {
                this.setState({posts: data.posts});

            })
            .fail(err => {
                let errorEl = document.getElementById('errorMsg');
                errorEl.innerHTML = `Error: ${err.error}`;
            });
    }

    render() {
		let post_list = this.state.posts.length > 0 ? 
			this.state.posts.map((post, index) => (<Post key={index} post={post} index={index} par={this}/>)):
			[];
        const user = this.props.user.getUser();
        const page_html = user.username !== '' ?
            <div>
				<div className="form-group">
					<label>Post Title</label>
					<input className="form-control" id="title" type="text"/>
				</div>
				<div className="form-group">
					<label>Post Content</label>
					<textarea className="form-control" id="content" rows="3"></textarea>
				</div>
				<button className="btn btn-primary" onClick={this.createPost}>Make Post</button>
				<p id="errorMsg" className="bg-danger"/>
				<div className="row">
					<div className="col-xs-4">
						<h4><b>Posts:</b></h4>
						<div className ="row">
							<table id="postsTable" className="col-xs-2 table">
								<thead>
									<tr>
										<th>Post</th>
									</tr>
								</thead>
								<tbody>{post_list}</tbody>
							</table>
						</div>
					</div>
					<div className="col-xs-8">
						<h4><b id="currPost"></b></h4>
						<h4 id="currAuth"/>
						<p id="currContent" />
					</div>
				</div>
            </div>:
            <div>Log in to view this information</div>;
        return <div>
            {page_html}
        </div>
    };
}

export default withRouter(MyLife);