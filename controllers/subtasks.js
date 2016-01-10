'use strict';

var Subtask = require('../models/subtask.js');
var Project = require('../models/project.js');
var errors = require('./errors.js');

// Get all subtasks for a task
exports.findAll = function(req, res, next) {
    // Verify that the user has access to the project information
    Project.findById(req.params.pid, '-__v', function(err, project) {
        if (err) return next(err);
        if (project.members.indexOf(req.decoded.id) != -1) {
            // User is a member of the project, let them have the data
            Subtask.find({task: req.params.tid}, '-__v', function(err, subtasks) {
                if (err) return next(err);
                res.json(subtasks);
            });
        }
        else {
            // User is not a member of the project and does not have the right
            // to the data, tell them so.
            return next(errors.newError(403));
        }
    });
};

// Get a specific subtask
exports.findById = function(req, res, next) {
    // Verify that the user has access to the project information
    Project.findById(req.params.pid, '-__v', function(err, project) {
        if (err) return next(err);
        if (project.members.indexOf(req.decoded.id) != -1) {
            console.log()
            // User is a member of the project, let them have the data
            Subtask.findOne({task: req.params.tid}, '-__v', function(err, subtask) {
                if (err) return next(err);
                // Return 404 for a nonexistant subtask
                //if (subtask == null) return next(errors.newError(404));
                res.json(subtask);
            });
        }
        else {
            // User is not a member of the project and does not have the right
            // to the data, tell them so.
            return next(errors.newError(403));
        }
    });
};

// Add a new subtask
exports.add = function(req, res, next) {
    var newSubtask = new Subtask();
    newSubtask.name = req.body.name;
    newSubtask.description = req.body.description || null;
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
        if (subtask == null) return next(errors.newError(404));
        subtask.name = req.body.name;
        subtask.description = req.body.description;
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
