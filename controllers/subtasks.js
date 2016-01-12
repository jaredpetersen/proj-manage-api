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
            // User is a member of the project, let them have the data
            Subtask.findOne({_id: req.params.sid, task: req.params.tid}, '-__v', function(err, subtask) {
                if (err) return next(err);
                // Return 404 for a nonexistant subtask
                if (subtask == null) return next(errors.newError(404));
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
    Project.findById(req.params.pid, '-__v', function(err, project) {
        if (err) return next(err);
        if (project.members.indexOf(req.decoded.id) != -1) {
            // User is a member of the project, let them create the subtask
            var newSubtask = new Subtask();
            newSubtask.name = req.body.name;
            newSubtask.task = req.params.tid;
            newSubtask.due = req.body.due || null;
            newSubtask.save(function(err, newSubtask) {
                if (err) return next(err);
                res.status(201).json({"message": "Subtask Created!"});
            });
        }
        else {
            // User is not a member of the project and does not have the right
            // create the subtask, tell them so.
            return next(errors.newError(403));
        }
    });
};

// Update a specific subtask
exports.update = function(req, res, next) {
    Project.findById(req.params.pid, '-__v', function(err, project) {
        if (err) return next(err);
        if (project.members.indexOf(req.decoded.id) != -1) {
            // User is a member of the project, let them edit the subtask
            Subtask.findOne({_id: req.params.sid, task: req.params.tid}, function(err, subtask) {
                if (err) return next(err);
                // Return 404 for a nonexistant subtask
                if (subtask == null) return next(errors.newError(404));
                subtask.name = req.body.name || subtask.name;
                subtask.task = req.params.tid || subtask.task;
                // Assign subtask status as long as the status fits one of the
                // accepted statuses
                if (req.body.status == 'incomplete' ||
                    req.body.status == 'complete' ||
                    req.body.status == null) {
                    subtask.status = req.body.status || subtask.status;
                }
                else {
                    // Not an accepted status, let the user know they sent a
                    // bad request
                    return next(errors.newError(400));
                }
                // If the due field is not included, do not update
                if (req.body.due !== undefined) {
                    subtask.due = req.body.due;
                }
                subtask.save(function(err, subtask) {
                    if (err) return next(err);
                    res.json({"message": "Subtask Updated!"});
                });
            });
        }
        else {
            // User is not a member of the project and does not have the right
            // create the subtask, tell them so.
            return next(errors.newError(403));
        }
    });
};

// Delete a specific subtask
exports.delete = function(req, res, next) {
    Project.findById(req.params.pid, '-__v', function(err, project) {
        if (err) return next(err);
        if (project.members.indexOf(req.decoded.id) != -1) {
            // User is a member of the project, let them edit the subtask
            Subtask.findByIdAndRemove({_id: req.params.sid, task: req.params.tid}, function(err, subtask) {
                if (err) return next(err);
                // Return 404 for a nonexistant subtask
                if (subtask == null) return next(errors.newError(404));
                res.json({"message": "Subtask Deleted!"});
            });
        }
        else {
            // User is not a member of the project and does not have the right
            // create the subtask, tell them so.
            return next(errors.newError(403));
        }
    });
};
