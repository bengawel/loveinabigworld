'use strict';

let mongoose        = require('mongoose'),
    Schema          = mongoose.Schema;


let Task = new Schema({
    name:       { type: String, required: true},
    description:{ type: String, required: true},
    completed:  { type: Boolean, required: true, default: false}
}, {_id: false});

let Goal = new Schema({
    title:      { type: String, required: true},
    tasks:      { type: [ Task ]},
    current:    { type: Boolean, required: true, default: false}
}, { _id: false });

let GoalList = new Schema({
    owner:      { type: String, ref: 'User', required: true},
    goals:      { type: [ Goal ]}
});

module.exports = mongoose.model('GoalList', GoalList);
