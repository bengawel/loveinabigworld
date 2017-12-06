'use strict';

let mongoose        = require('mongoose'),
    Schema          = mongoose.Schema;
	
let Stat = new Schema({
    'title':      { type: String, required: true},
    'user':       { type: String, required: true},
    'content':    { type: String, required: true},
	'comments':	  [ {username: String, comm: String} ]
});

module.exports = mongoose.model('Stat', Stat);
