'use strict';

let mongoose        = require('mongoose'),
    Schema          = mongoose.Schema;


let Task = new Schema({
    description:{ type: String, required: true},
    completed:  { type: Boolean, required: true, default: false}
}, {_id: false});

let Goal = new Schema({
    title:      { type: String, required: true},
    tasks:      { type: [ Task ]},
    current:    { type: Boolean, required: true, default: false}
});


module.exports = mongoose.model('Goal', Goal);
