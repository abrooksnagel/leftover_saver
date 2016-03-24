/**
 * Created by abrooksnagel on 2/2/16.
 */
 //Brings in my required libraries\\
var express = require('express');
var path = require('path');
var passport = require('passport');

  //Establishes router as an express router to be used to create routes below\\
var router = express.Router();

  //Requires my models\\
var Leftover = require('../../models/leftovers');
var User = require('../../models/user');

  //Creates the routes\\
router.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, '../public/views/index.html'));
});

router.get('/success', function(request, response) {
    response.send('success');
});

router.get('/failure', function(request, response) {
    response.send('failure');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/success', failureRedirect:'/failure'
}));

router.post('/register', function(request, response){
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
    //find user that was requested\\
    User.findById(request.user.id, function(err, user){
        if(err) {
            console.log('Error saving user leftover', err);
        } else {

            //create leftover with request.body.leftover sent from client\\
            Leftover.create(request.body.leftover, function(err, leftover){
                console.log('Error saving leftover', err);

                //associate the leftover with current user\\
                user.leftovers.push(leftover);

                //save user with new leftover\\
                user.save(function(err){
                    if(err){
                        console.log('error saving user', err);
                        response.sendStatus(500);
                    }
                });
                response.sendStatus(200);
            });
        }
    });
});

router.get('/show', function(request, response) {
    //find current user\\
    User.findById(request.user.id, function(err, user) {
        if(err) {
            console.log("error returning leftovers", err);
        } else {
            response.send(user.leftovers);
        }
    });
});

router.delete('/delete/:id', function(request, response, next){
    response.send('/choose');
    console.log("The id of the selected leftover",request.params.id);
    //find and remove leftover based on request from client\\
    Leftover.find({_id: request.params.id}).remove().exec();

    //find current user\\
    User.findById(request.user.id, function(err, user){
      console.log("user in delete route", user);

        //associate updated (removed) leftover with current user\\
        user.leftovers.pull({_id: request.params.id});

        //save the change\\
        user.save();
    });
});

//This exports this router to be used by server.js\\
module.exports = router;/**
 * Created by abrooksnagel on 2/13/16.
 */
