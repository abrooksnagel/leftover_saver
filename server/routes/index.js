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
    //Find user that was requested
    User.findById(request.user.id, function(err, user){
        if(err) {
            console.log('Error saving leftover', err);
        } else {

            //found user

            //create leftover with request.body.leftover

            //Create leftover from data send by client
            Leftover.create(request.body.leftover, function(err, leftover){
                console.log('Error saving leftover', err);


                //Associate with user
                user.leftovers.push(leftover);

                //Save user (now with leftover)
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
    User.findById(request.user.id, function(err, user) {
        if(err) {
            console.log("error returning leftovers", err);
        } else {
            console.log("showing leftovers in show router", user.leftovers);
            response.send(user.leftovers);
        }
    });
});


router.delete('/delete', function(request, response) {
   console.log("in delete router", request.query);

  //  Leftover.findById(request.leftovers.id, function(err, leftover) {
  //      if(err) {
  //          console.log('Error deleting leftover', err);
  //      } else {
  //          response.sendStatus(200);
   //
  //          Leftover.delete(request.body.leftover, function(err, leftover){
  //              console.log('Error saving leftover', err);
   //
   //
  //              //Associate with user
  //              user.leftovers.push(leftover);
   //
  //              //Save user (now with leftover)
  //              user.save(function(err){
  //                  if(err){
  //                      console.log('error saving user', err);
  //                      response.sendStatus(500);
  //                  }
  //              });
   //
  //              response.sendStatus(200);
   //
  //          });
  //      }
   //});

});

//This exports this router to be used by server.js\\
module.exports = router;/**
 * Created by abrooksnagel on 2/13/16.
 */
