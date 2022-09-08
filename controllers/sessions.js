// Dependencies
const express = require('express');
const bcrypt = require('bcrypt');
const sessionsRouter = express.Router();
const User = require('../models/user.js');

// New (login page)
sessionsRouter.get('/new', (req, res) => {
	res.render('sessions/new.ejs', {
        currentUser: req.session.currentUser
    });
})

// Delete (logout route)
sessionsRouter.delete('/', (req, res) => {
    req.session.destroy((error) => {
        res.redirect('/');
    })
})

// Create (login route)
sessionsRouter.post('/', (req, res) => {
    //check for existing user
    User.findOne({
        email: req.body.email,
    }, (error, foundUser) => {
        //sends a message saying the user email is not in the database
        if (!foundUser) {
            res.send(`Oops! We do not have a user with that email address.`);
        }
        //compares the given password with the hashed password stored
        if (foundUser) {
            const passwordMatches = bcrypt.compareSync(req.body.password, foundUser.password); //compares the password entered in the body with the password linked to the one stored at "foundUser"

            //if the password matches, we add the user to the session
            if (passwordMatches) {
                req.session.currentUser = foundUser;

                //redorect the user back to the home page
                res.redirect('/');
            }
            //if the passwords do not match
            if (!passwordMatches) {
                res.send("Oops! The credentials entered are invalid..")
            }
        }
    });
});

// Export Sessions Router
module.exports = sessionsRouter;