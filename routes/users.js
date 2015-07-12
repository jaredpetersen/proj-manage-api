var User = require('../models/user');
var express = require('express');
var router = express.Router();

router.route('/users')

    // Create a user (accessed at POST http://localhost:8087/users)
    .post(function(req, res, next) {
        // New user instance based on the user model
        var user = new User();
        user.username = req.body.username;
        user.first_name = req.body.first_name;
        user.last_name = req.body.last_name;

        // Save the user and check for errors
        user.save(function(err) {
            if (err) { next(err); }
            else { res.json({ message: 'User created!' }); }
        });
    })

    // Get all of the users (accessed at GET http://localhost:8087/users)
    .get(function(req, res, next) {
        User.find(function(err, users) {
            if (err) { next(err); }
            else { res.json(users); }
        }).select('-__v');
    });

router.route('/users/:user_id')

    // Get the user associated with the id (accessed at GET http://localhost:8087/users/:user_id)
    // Make sure to remove the API version from the output
    .get(function(req, res, next) {
        User.findById(req.params.user_id, function(err, user) {
            if (err) { next(err); }
            else { res.json(user); }
        }).select('-__v');
    })

    // Update the user associated with the id (accessed at PUT http://localhost:8087/users/:user_id)
    .put(function(req, res, next) {
        // Use the user model to find the desire user
        User.findById(req.params.user_id, function(err, user) {
            if (err) { next(err); }
            else {
                // Update the user's info
                user.username = req.body.username;
                user.first_name = req.body.first_name;
                user.last_name = req.body.last_name;
                // Save the user
                user.save(function(err) {
                    if (err) { next(err); }
                    else { res.json({ message: "User updated!" }); }
                });
            }
        });
    })

    // Delete the user with the assciated id (accessed at DELETE http://localhost:8087/users/:user_id)
    .delete(function(req, res, next) {
        User.remove(
            { _id: req.params.user_id },
            function(err, user) {
                if (err) { next(err); }
                else { res.json({ message: "User deleted!" }); }
            }
        );
    });

// Catch validation errors, 404s, etc.
router.use(function(err, req, res, next) {
    console.log(err.name);
    if (err.name == "ValidationError") {
        // User's request didn't match up with the required data
        res.status(400).json({"message": "Bad Request"});
    }
    else if (err.name == "CastError") {
        // Couldn't find the user id
        res.status(404).json({"message": "Not Found"});
    }
    else {
        // Something else went wrong
        res.status(500).json({"message": "Internal Server Error"});
    }
});

module.exports = router;
