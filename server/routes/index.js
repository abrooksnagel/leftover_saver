/**
 * Created by abrooksnagel on 2/2/16.
 */
//These bring in my required libraries
var express = require('express');
var path = require('path');
var passport = require('passport');




//This establishes router as an express router to be used to create routes below
var router = express.Router();


var User = require('../../models/user');

//This creates the router used to serve the index.html
router.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, '../public/views/index.html'));
});


router.get('/choose', function(request, response) {
    response.send();
});


router.post('/login', passport.authenticate('local', {
    successRedirect: '/choose', failureRedirect:'/login'
}));





router.post('/register', function(request, response){
    console.log(request.body);
    User.create(request.body, function(err, user){
        if(err) {
            console.log('Error saving user', err);
            next(err);
        } else {
            response.sendStatus(200);
        }
    });
});

router.post('/save', function(request, response) {
    console.log(request.body);

    User.findById(request.user.id, function(err, user){
        if(err) {
            console.log('Error saving leftover', err);
        } else {

            //found user

            user.leftovers.push(request.body.leftover);

            user.save(function(err){
                if(err){
                    console.log('error saving user', err);
                }
            });

            response.sendStatus(200);
        }
    });
});





//This exports this router to be used by server.js
module.exports = router;