'use strict';

var Task = require('../models/task.js');
var Project = require('../models/project.js');
var errors = require('./errors.js');

// Get all tasks for the user
exports.findAll = function(req, res, next) {
    Task.find({owner: req.decoded.id}, '-__v', function(err, tasks) {
        if (err) return next(err);
        res.json(tasks);
    });
};

// Get all tasks for the user
exports.findProjectTasks = function(req, res, next) {
    Project.findById(req.params.id, '-__v', function(err, project) {
        if (err) return next(err);
        if (project.members.indexOf(req.decoded.id) != -1) {
            // User is a member of the project, let them have the data
            Task.find({project: req.params.id}, '-__v', function(err, tasks) {
                if (err) return next(err);
                res.json(tasks);
            });
        }
        else {
            // User is not a member of the project and does not have the right
            // to the data, tell them so.
            return next(errors.newError(403));
        }
    });
};

// Get a specific task
exports.findById = function(req, res, next) {
    Task.findById(req.params.id, '-__v', function(err, task) {
        if (err) return next(err);
        // Return 404 for a nonexistant task
        if (task == null) return next(errors.newError(404));
        res.json(task);
    });
};

// Add a new task
exports.add = function(req, res, next) {
    Project.findById(req.body.project, '-__v', function(err, project) {
        if (err) return next(err);
        // Return 404 for a nonexistant project
        if (project == null) return next(errors.newError(404));
        // Otherwise, create the task if the user is a member of the project
        if (project.members == req.decoded.id) {
            var newTask = new Task();
            newTask.name = req.body.name;
            newTask.description = req.body.description || null;
            newTask.owner = req.body.owner || null;
            newTask.project = req.body.project;
            newTask.save(function(err, newTask) {
                if (err) return next(err);
                res.status(201).json({"message": "Task Created!"});
            });
        }
        else {
            // The user is not a member, tell them they can't add a task
            return next(errors.newError(403));
        }
    });
};

// Update a specific task
exports.update = function(req, res, next) {
    Task.findById(req.params.id, function(err, task) {
        if (err) return next(err);
        // Return 404 for a nonexistant task
        if (task == null) return next(errors.newError(404));
        task.name = req.body.name;
        task.description = req.body.description;
        task.owner = req.body.owner;
        task.project = req.body.project;
        task.save(function(err, task) {
            if (err) return next(err);
            res.json({"message": "Task Updated!"});
        });
    });
};

// Delete a specific task
exports.delete = function(req, res, next) {
    Task.findByIdAndRemove({_id: req.params.id}, function(err, task) {
        if (err) return next(err);
        // Return 404 for a nonexistant task
        if (task == null) return next(errors.newError(404));
        res.json({"message": "Task Deleted!"});
    });
};
