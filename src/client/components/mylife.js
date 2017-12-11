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
		
		// UNIT TESTING
		// this.testPost = this.testPost.bind(this);
    }

	updateDisplay(c, e) {
		e.preventDefault();
		let postEl = document.getElementById('currPost');
        postEl.innerHTML = c.title;
		let authEl = document.getElementById('currAuth');
        authEl.innerHTML = "Posted by " + c.user;
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
	
	// UNIT TESTS
	/*testPost() {
		const data = {
            title:       "test title",
            user:     	 "testusername",
            content:     "test content",
        };
		
        $.ajax({
			// simple data test
            url: `/v1/posts`,
            method: "post",
            data: data
        })
            .then(data => {
				console.log("Testing simple post [POST] - success");
                console.log(data.statuses);
            })
            .fail(err => {
                console.log("Testing simple post [POST] - fail");
				console.log(err.responseJSON.error);
            });
			
		const data_bad1 = {
            title:       "test title",
            user:     	 "username_With_Bad_Chars",
            content:     "test content",
			comments:	 []
        };
		
        $.ajax({
			// bad data test
            url: `/v1/posts`,
            method: "post",
            data: data_bad1
        })
            .then(data => {
				console.log("Testing bad post [POST] - fail (should have been an error)");
                console.log(data.statuses);
            })
            .fail(err => {
                console.log("Testing bad post [POST] - success");
				console.log(err.responseJSON.error);
            });
			
		const data2 = {
            title:       "test title",
            user:     	 "testusername",
            content:     12,
			comments:	 []
        };
		
        $.ajax({
			// alternate data test
            url: `/v1/posts`,
            method: "post",
            data: data2
        })
            .then(data => {
				console.log("Testing alternate post [POST] - success");
                console.log(data.statuses);
				
            })
            .fail(err => {
                console.log("Testing alternate post [POST] - fail");
				console.log(err.error);
            });	
			
		$.ajax({
			// get data test
            url: `/v1/posts`,
            method: "get"
        })
            .then(data => {
				console.log("Testing post [GET] - success");
				console.log(data.statuses);
				
            })
            .fail(err => {
				console.log("Testing post [GET] - fail");
				console.log(err.error);
            });
	} */
	
	
     componentDidMount() {
		 
		 // UNIT TESTING
		// this.testPost();
		 
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
						<div className="panel panel-primary">
							<div className="panel-heading">
								<h4 className="card-title"><b id="currPost"/></h4>
							</div>
							<div className="panel-body mb-2 text-muted"><h6 id="currAuth"/></div>
							<div className="panel-body" id="currContent" />
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

export default withRouter(MyLife);