'use strict';

let Joi         = require('joi');


module.exports = (app) => {
	
	app.post('/v1/posts', function(req, res) {
        // Schema for user info validation
        let schema = Joi.object().keys({
			title:      	Joi.string().allow(''),
			user:       	Joi.string().lowercase().alphanum().min(3).max(32).required(),
			content:    	Joi.string().allow('')
        });
		
		Joi.validate(req.body, schema, { stripUnknown: true }, (err, data) => {
            if (err) {
                const message = err.details[0].message;
                console.log(`Post.create validation failure: ${message}`);
                res.status(400).send({ error: message });
            } else {
                let post = new app.models.Post(data);
                post.save().then(
                    () => {
                        // Send the happy response back
                        res.status(201).send({
                            post:       	post,
                        });
                    }, err => {
                        console.log(err);
                        // Something failed
                        res.status(400).send({error: 'invalid format'});

                    }
                );
            }
        });
	});
	
	app.get('/v1/posts', (req, res) => {
        app.models.Post.find({})
			//.populate('posts')
			//.exec()
			//.exec( function (err, posts) {
				//if(err) return res.status(500).send({ error: 'server error' }); 
				//res.status(200).send({ posts:	postlist.posts });)
            .then(
                postlist => {
                        res.status(200).send({
                            //posts:	postlist.posts	
							posts:		postlist
                        });
                }, err => {
                    console.log(err);
                    res.status(500).send({ error: 'server error' });
                }
            );
    });
};
