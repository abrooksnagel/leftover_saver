/**
 * Created by abrooksnagel on 2/2/16.
 */
//These bring in my required libraries
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');

var localStrategy = require('passport-local').Strategy;

//This requires the index router
var index = require('./routes/index');
var User = require('../models/user');

//This creates an express app
var app = express();




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    cookie: {maxAge: 60000, secure: false}
}));

app.use(passport.initialize());
app.use(passport.session());


//This is telling server to use index router
app.use(express.static('server/public'));
app.use('/', index);


//This creates and connects to my database
var mongoURI = 'mongodb://localhost:27017/leftover_saver';
var mongoDB = mongoose.connect(mongoURI).connection;


//These log whether there is an error or a connection
mongoDB.on('error', function(err) {
    console.log('MongoDB error:', err);
});

mongoDB.on('open', function() {
    console.log('MongoDB connected');
});

passport.serializeUser(function(user, done) {
    console.log("Serialize ran");
    console.log(user._id);
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    console.log("Deserialize ran", id);
    User.findById(id, function(err, user) {
        if(err) {
            done (err);
        }
        done(null, user);
    })
});

passport.use('local', new localStrategy({
    passReqToCallback: true, usernameField: 'username'},
    function(req, username, password, done) {
        User.findOne({username: username}, function(err, user) {
            if(err) {
                console.log(err);
            }
            if(!user) {
                return done(null, false);
            }

            user.comparePassword(password, function(err, isMatch) {
                if(err) {
                    console.log(err);
                }
                if(isMatch) {
                    done(null, user);
                } else {
                    done(null, false);
                }

            })
        })
}));


//This creates my server
var server = app.listen(3000, function() {
    var port = server.address().port;
    console.log("Listening on port", port);
});