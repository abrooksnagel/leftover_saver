var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Leftover = require('./leftovers').schema;

var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
    username: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true},
    contact: {
        phoneNumber: {type: Number},
        mobileProvider: {type: String},
        email: {type: String}},
    leftovers: [Leftover]
}, {minimize: false});

UserSchema.pre('save', function(next) {
    var user = this;
    if(!user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if(err) return next(err);
        console.log('Salt', salt);
        bcrypt.hash(user.password, salt, function(err, hash) {
            if(err) return next(err);
            console.log('Hash', hash);
            user.password = hash;
            next();
        })
    });
});

UserSchema.methods.comparePassword = function(submittedPassword, callBack) {
    bcrypt.compare(submittedPassword, this.password, function(err, isMatch) {
        if(err) {
            return callBack(err);
        }
        callBack(null, isMatch);
    })
};

var User = mongoose.model('User', UserSchema);

module.exports = User;
