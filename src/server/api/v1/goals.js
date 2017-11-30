'use strict';

let Joi         = require('joi');


module.exports = (app) => {

    app.post('/v1/goals', (req, res) => {
        if (!req.session.user) {
            res.status(401).send({error: 'unauthorized'});
        } else {
            app.models.User.findOne({username: req.session.user.username.toLowerCase()})
                .then(
                    user => {
                        if (!user) res.status(404).send({error: 'user not found'});
                        else {
                            let taskSchema = Joi.object().keys({
                                description:  Joi.string().required()
                            });
                            let schema = Joi.object().keys({
                                title:      Joi.string().required(),
                                tasks:      Joi.array().items(taskSchema)
                            });
                            Joi.validate(req.body, schema, {stripUnknown: true}, (err, data) => {
                                if(err) {
                                    const message = err.details[0].message;
                                    console.log(`Goal.put validation failure: ${message}`);
                                    res.status(400).send({error: message});
                                } else {
                                    let newGoal = {
                                        title:      data.title,
                                        tasks:      data.tasks,
                                        current:    data.current
                                    };
                                    let goal = new app.models.Goal(newGoal);
                                    user.goals.push(goal);
                                    user.save(err => {
                                        if (err) {
                                            console.log(`Goal.put save failure: ${err} ${goal}`);
                                            res.status(400).send({error: 'failure saving goal'});
                                        } else {
                                            res.status(201).end();
                                        }
                                    })
                                }
                            })
                        }
                    }
                )

        }
    });

    app.get('/v1/goals/:username', (req, res) => {
        app.models.User.findOne({ username: req.params.username.toLowerCase() })
            .populate('goals')
            .exec()
            .then(
                user => {
                    if (!user) res.status(404).send({ error: `User does not exist` });
                    else {
                        console.log(user);
                        console.log(user.goals);
                        res.status(200).send({
                            goals:          user.goals
                        });
                    }
                }, err => {
                    console.log(err);
                    res.status(500).send({ error: 'server error' });
                }
            );
    });
};
