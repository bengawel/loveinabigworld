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
                                    goal.save(err => {
                                        if (err) {
                                            console.log(`Goal.create save failure: ${err}`);
                                            res.status(400).send({error: 'failure creating goal'});
                                        } else {
                                            const query = { $push: { goals: goal._id}};
                                            app.models.User.findOneAndUpdate({_id: req.session.user._id}, query, () => {
                                                res.status(201).send({
                                                    id: goal._id
                                                });
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    }
                )
        }
    });

    app.get('/v1/goals/mygoal/:goalid', (req, res) => {
        if (!req.session.user) {
            res.status(401).send({ error: 'unauthorized'});
        } else {
            app.models.Goal.findById(req.params.goalid)
                .then(
                    goal => {
                        if (!goal) {
                            res.status(404).send({error: `unknown goal: ${req.params.id}`});
                        } else {
                            res.status(200).send({goal: goal})
                        }
                    }, err => {
                        console.log(`Goal.get failure: ${err}`);
                        res.status(404).send({error: `unknown goal: ${req.params.id}`});
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

    //TODO: in the query finding current goals, add an and to make it per user, right now gets rid of all current
    app.put('/v1/goals/current/:goalid', (req, res) => {
        app.models.Goal.find({current: true})
            .then(
                results => {
                    if (results) {
                        results.forEach(function(goal) {
                            goal.current = false;
                            goal.save(err => {
                                if (err) {
                                    console.log(`Goal.put current save failure: ${err}`);
                                    res.status(400).send({error: 'failure saving current goal'});
                                }
                            })
                        });
                    }
                    app.models.Goal.findById(req.params.goalid)
                        .then(
                            goal => {
                                if (!goal) {
                                    res.status(404).send({error: `unknown goal: ${req.params.id}`});
                                } else {
                                    goal.current = true;
                                    goal.save(err => {
                                        if (err) {
                                            console.log(`Goal.put current save failure: ${err}`);
                                            res.status(400).send({error: 'failure saving current goal'});
                                        } else {
                                            res.status(201).end();
                                        }
                                    })
                                }
                            }, err => {
                                console.log(err);
                                res.status(500).send({ error: 'server error' });
                            }
                        )
                }, err => {
                    console.log(err);
                    res.status(500).send({ error: 'server error' });
                }
            )
    })
};
