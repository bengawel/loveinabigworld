'use strict';

let mongoose        = require('mongoose'),
    Schema          = mongoose.Schema;

let Post = new Schema({
    'title':      { type: String, required: true},
    'user':       { type: String, required: true},
    'content':    { type: String, required: true}
});

module.exports = mongoose.model('Post', Post);
