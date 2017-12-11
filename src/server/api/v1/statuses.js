'use strict';

let Joi         = require('joi');


module.exports = (app) => {
	
	app.post('/v1/statuses', function(req, res) {
        // Schema for user info validation
        let schema = Joi.object().keys({
			title:      	Joi.string().allow(''),
			user:       	Joi.string().lowercase().alphanum().min(3).max(32).required(),
			content:    	Joi.string().allow('')
        });
		
		Joi.validate(req.body, schema, { stripUnknown: true }, (err, data) => {
            if (err) {
                const message = err.details[0].message;
                console.log(`Statuses.create validation failure: ${message}`);
                res.status(400).send({ error: message });
            } else {
                let stat = new app.models.Stat(data);
                stat.save().then(
                    stat => {
                        // Send the happy response back
                        res.status(201).send({
                            statuses:       	stat,
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
	
	app.post('/v1/comment/:id', function (req, res) {
        var comment = {"username": req.body.usrn, "comm": req.body.cont};
		
		let schema = Joi.object().keys({
			username:      	Joi.string().allow(''),
			comm:   	 	Joi.string().allow('')
        });
		
		Joi.validate(req.body, schema, { stripUnknown: true }, (err, data) => {
            if (err) {
                const message = err.details[0].message;
                console.log(`Comment validation failure: ${message}`);
                res.status(400).send({ error: message });
            } else {
		
				app.models.Stat.findByIdAndUpdate(req.params.id, {$push: {comments: comment}}, {new: true})
					.then(
						updated_Status => {
							res.status(201).send({statuses: updated_Status});
						}, err => {
							console.log(err);
							res.status(500).send({error: 'server error'})
						}
					);
			}
		});
    });
	
	app.get('/v1/statuses', (req, res) => {
        app.models.Stat.find({})
            .then(
                statlist => {
                        res.status(200).send({
							statuses:		statlist
                        });
                }, err => {
                    console.log(err);
                    res.status(500).send({ error: 'server error' });
                }
            );
    });
};
