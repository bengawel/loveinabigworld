"use strict";

let crypto          =require('crypto'),
    mongoose        =require('mongoose'),
    Schema          =mongoose.Schema;


const makeSalt = () => (
    Math.round((new Date().valueOf() * Math.random())) + ''
);

const encryptPassword = (salt, password) => (
    crypto.createHmac('sha512', salt).update(password).digest('hex')
);

const reservedNames = ['password'];


//TODO: change dob type
let User = new Schema({
    'username':     {type: String, required: true, index: { unique: true } },
    'primary_email':{type: String, required: true, index: { unique: true } },
    'real_name':    {type: String, default: ''},
    'nick_name':    {type: String, default: ''},
    'dob':          {type: String, default: '' },
    'gender':       {type: String, default: ''},
    'city':         {type: String, default: ''},
    'phone_number': {type: String, default: ''},
    'hash':         {type: String, required: true},
    'salt':         {type: String, required: true},
    'goals':        {type: Schema.Types.ObjectId, ref: 'GoalList'}
});

User.path('username').validate(function(value) {
    if (!value) return false;
    if (reservedNames.indexOf(value) !== -1) return false;
    return (value.length > 5 && value.length <= 16 && /^[a-zA-Z0-9]+$/i.test(value));
}, 'invalid username');

User.path('primary_email').validate(function(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}, 'malformed address');

User.virtual('password').set(function(password) {
    this.salt = makeSalt();
    this.hash = encryptPassword(this.salt, password);
});

User.method('authenticate', function(plainText) {
    return encryptPassword(this.salt, plainText) === this.hash;
});


//TODO: string phone number of dashes, leave only numbers
User.pre('save', function(next) {
    this.username       = this.username.toLowerCase();
    this.primary_email  = this.primary_email.toLowerCase();
    this.real_name      = this.real_name.replace(/<(?:.|\n)*?>/gm, '');
    this.nick_name      = this.nick_name.replace(/<(?:.|\n)*?>/gm, '');
    this.gender         = this.gender.replace(/<(?:.|\n)*?>/gm, '');
    this.city           = this.city.replace(/<(?:.|\n)*?>/gm, '');
    this.phone_number   = this.phone_number.replace(/<(?:.|\n)*?>/gm, '');
    next();
});

module.exports = mongoose.model('User', User);