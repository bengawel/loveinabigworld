'use strict';

let Joi         = require('joi');


module.exports = (app) => {app.get('/v1/user/:username', (req, res) => {


    app.models.User.findOne({ username: req.params.username.toLowerCase() })
        .populate('goals')
        .exec()
        .then(
            user => {
                if (!user) res.status(404).send({ error: `unknown user: ${req.params.username}` });
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
};
