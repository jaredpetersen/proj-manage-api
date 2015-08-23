'use strict';

var User = require('../models/user.js');
var bcrypt = require('bcryptjs');

// Get all users
exports.findAll = function(req, res, next) {
    User.find(function(err, users) {
        if (err) return next(err);
        res.json(users);
    }).select('-password -__v');
};

// Get a specific user
exports.findById = function(req, res, next) {
    User.findById(req.params.id)
    .select('-__v')
    .exec(function(err, project) {
        if (err) return next(err);
        res.json(project);
    });
};

// Register a user
exports.add = function(req, res, next) {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt);
    var newUser = new User();
    newUser.email = req.body.email;
    newUser.first_name = req.body.first_name;
    newUser.last_name = req.body.last_name;
    newUser.password = hash;
    //console.log(newUser);
    newUser.save(function(err, newUser) {
        if (err) return next(err);
        res.status(201).json({"message": "User Registered!"});
    });
};

// Update a specific user (no password)
exports.update = function(req, res, next) {
    User.findById(req.params.id, function(err, project) {
        if (err) return next(err);
        project.email = req.body.email;
        project.first_name = req.body.first_name;
        project.last_name = req.body.last_name;
        project.save(function(err, project) {
            if (err) return next(err);
            res.json({"message": "User Updated!"});
        });
    });
};

// Delete a specific user
exports.delete = function(req, res, next) {
    User.remove(
        {_id: req.params.id},
        function(err, user) {
            if (err) return next(err);
            res.json({"message": "User Deleted!"});
    });
};
