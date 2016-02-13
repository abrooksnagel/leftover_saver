/**
 * Created by abrooksnagel on 2/2/16.
 */
//These bring in my required libraries
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var nodemailer = require('nodemailer');


var localStrategy = require('passport-local').Strategy;

//This requires the index router and mongoose models\\
var index = require('./routes/index');
var User = require('../models/user');
var Leftover = require('../models/leftovers');
//var contactUser = require('./routes/index');  Do i need this?????????

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
//app.use('/contact', index); Do I need this????



    //))))))))))))))))))((((((((((((((((((\\
    //           Using mongoose           \\
    //))))))))))))))))))((((((((((((((((((\\
var mongoURI = 'mongodb://localhost:27017/leftover_saver';
var mongoDB = mongoose.connect(mongoURI).connection;



mongoDB.on('error', function(err) {
    console.log('MongoDB error:', err);
});

mongoDB.on('open', function() {
    console.log('MongoDB connected');
});

    //)))))))))))))))))((((((((((((((((((\\
    //         Using passport            \\
    //))))))))))))))))))(((((((((((((((((\\
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


    //))))))))))))))))))))))(((((((((((((((((((((\\
    //     This sets up my nodemailer            \\
    //))))))))))))))))))))))(((((((((((((((((((((\\

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'leftoversaver@gmail.com',
        pass: 'leftover'
    }
});


//Moved the sendMessage function from here to inside the find


    //))))))))))))))))))))))))))(((((((((((((((((((((((((((\\
    //This will run the findUser() function every six hours\\
    //))))))))))))))))))))))))))(((((((((((((((((((((((((((\\
var testInt = setInterval(findUser, 6 * 60 * 60 * 1000);



    //))))))))))))))))))))))))(((((((((((((((((((((((((((((\\
    //Attempting to find user information from the database\\
    //)))))))))))))))))))))))))((((((((((((((((((((((((((((\\
var userContact;
var userLeftover;
var userDateSaved;


function findUser() {
    //)))))))))))))))))))))))))))))))))))))((((((((((((((((((((((((((((\\
    // These are some alternative search parameters I used for testing   \\
    //           "contact.email": "test@test.com"                          \\
    // User.find({"contact.email": "test@test.com"}, function (err, user) {  \\
    //)))))))))))))))))))))))))))((((((((((((((((((((((((((((((((((((((((((((((\\


    //))))))))))))))))))))))))))(((((((((((((((((((((((\\
    //         creating search parameters              \\
    //)))))))))))))))))))))))((((((((((((((((((((((((((\\
    var startSearch = new Date(Date.now()- 60 * 60 * 60 * 1000);
    var endSearch = new Date(Date.now() - 54 * 60 * 60 * 1000);
    console.log(startSearch);
    console.log(endSearch);

    User.find({leftovers : {$elemMatch: {entryDate : { $gte: startSearch, $lt: endSearch }}}}, function (err, user) {
        //User.find({"leftovers.entryDate" : { $gte: '02-01-2016' }}, function (err, user) {
        if (err) {
            console.log('error returning contact items', err);
        } else {
            //response.send(user);
            console.log('showing items for contact', user);
        }
        userContact = user[0].contact.phoneNumber + user[0].contact.mobileProvider;
        userLeftover = user[0].leftovers[0].foodItem;
        var options = { weekday: "long", year: "numeric", month: "short",
            day: "numeric" };
        userDateSaved = user[0].leftovers[0].entryDate.toLocaleTimeString("en-US", options);
        console.log('inside findUsers function', userDateSaved);
    });

    var slowDownMessage = setTimeout(sendMessage, 10 * 1000);

};


    //))))))))))))))))))))))))))))))((((((((((((((((((((((((((((((\\
    //  Another attempt at find user information in the database  \\
    //))))))))))))))))))))))))))))))((((((((((((((((((((((((((((((\\
        //Leftover.find({entryDate : {$gte: '02-01-2016'}}, function (err, user) {
        //    if(err) {
        //        console.log('Error returning contact leftovers', err);
        //    } else {
        //        //response.send(user);
        //
        //        console.log('showing items for contact', user);
        //        console.log('testing the interval');
        //    }
        //});




    //)))))))))))))))))))))))))))))!(((((((((((((((((((((((((((\\
    //                  Using nodemailer                       \\
    // This will text or email users that 60 hours have passed \\
    //)))))))))))))))))))))))))))))!(((((((((((((((((((((((((((\\
var sendMessage = function() {
    transporter.sendMail({
        from: 'leftoversaver@gmail.com',
        to: userContact,
        subject: 'Eat those leftovers',
        text: 'You saved ' + userLeftover + ' on ' + userDateSaved + '!'
    });
    console.log('Message sent', userContact);
};




    //)))))))))))(((((((((((\\
    //This creates my server\\
    //)))))))))))(((((((((((\\
var server = app.listen(3000, function() {
    var port = server.address().port;
    console.log("Listening on port", port);
});

