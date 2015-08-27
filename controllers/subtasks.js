'use strict';

var Subtask = require('../models/subtask.js');
var errors = require('./errors.js');

// Get all subtasks
exports.findAll = function(req, res, next) {
    Subtask.find(null, '-__v', function(err, subtasks) {
        if (err) return next(err);
        res.json(subtasks);
    });
};

// Get a specific subtask
exports.findById = function(req, res, next) {
    Subtask.findById(req.params.id, '-__v', function(err, subtask) {
        if (err) return next(err);
        // Return 404 for a nonexistant subtask
        if (subtask == null) return next(errors.newError(404));
        res.json(subtask);
    });
};

// Add a new subtask
exports.add = function(req, res, next) {
    var newSubtask = new Subtask();
    newSubtask.name = req.body.name;
    newSubtask.description = req.body.description || null;
    newSubtask.owner = req.body.owner || null;
    newSubtask.task = req.body.task;
    newSubtask.save(function(err, newSubtask) {
        if (err) return next(err);
        res.status(201).json({"message": "Subtask Created!"});
    });
};

// Update a specific subtask
exports.update = function(req, res, next) {
    Subtask.findById(req.params.id, function(err, subtask) {
        if (err) return next(err);
        // Return 404 for a nonexistant subtask
        if (user == null) return next(errors.newError(404));
        subtask.name = req.body.name;
        subtask.description = req.body.description;
        subtask.owner = req.body.owner;
        subtask.task = req.body.task;
        subtask.save(function(err, subtask) {
            if (err) return next(err);
            res.json({"message": "Subtask Updated!"});
        });
    });
};

// Delete a specific subtask
exports.delete = function(req, res, next) {
    Subtask.findByIdAndRemove({_id: req.params.id}, function(err, subtask) {
        if (err) return next(err);
        // Return 404 for a nonexistant subtask
        if (subtask == null) return next(errors.newError(404));
        res.json({"message": "Subtask Deleted!"});
    });
};
