'use strict';

var Project = require('../models/project.js');
var Task = require('../models/task.js');
var errors = require('./errors.js');
var async = require("async");

// Get all projects
exports.findAll = function(req, res, next) {
    Project.find({owner: req.decoded.id}, '-__v', function(err, projects) {
        if (err) return next(err);
        res.json(projects);
    });
};

// Get a specific project
exports.findById = function(req, res, next) {
    Project.findOne({_id: req.params.id, members: {$in: [req.decoded.id]} }, '-__v', function(err, project) {
        if (err) return next(err);
        // Return 404 for a nonexistant project
        if (project == null) return next(errors.newError(404));
        res.json(project);
    });
};

// Add a new project
exports.add = function(req, res, next) {
    var newProject = new Project();
    newProject.name = req.body.name;
    newProject.description = req.body.description || null;
    newProject.owner = req.decoded.id;
    newProject.members = req.decoded.id;
    newProject.save(function(err, newUser) {
        if (err) return next(err);
        res.status(201).json({"message": "Project Created!"});
    });
};

// Update a specific project
exports.update = function(req, res, next) {
    Project.findById(req.params.id, function(err, project) {
        if (err) return next(err);
        // Return 404 for a nonexistant project
        if (project == null) return next(errors.newError(404));

        // Check for permissions
        if (project.members.indexOf(req.decoded.id) !== -1) {
            // Begin a series of checks for items that need to be updated
            // This prevents null values for being sent in for updating
            if (req.body.name !== undefined) {
                project.name = req.body.name;
            }

            if (req.body.description !== undefined) {
                project.description = req.body.description;
            }

            if (req.body.owner !== undefined) {
                project.owner = req.body.owner;
            }

            project.save(function(err, project) {
                if (err) return next(err);
                res.json({"message": "Project Updated!"});
            });
        }
        else {
            // User is not a member of the project and does not have a right
            // to the data, tell them so.
            return next(errors.newError(403));
        }
    });
};

// Delete a specific project
exports.delete = function(req, res, next) {
    // Can't use findByIdAndRemove() or Model.remove() in order to invoke
    // the middleware; Have to remove a specific document
    Project.findById(req.params.id, function(err, project) {
        if (err) return next(err);
        // Return 404 for a nonexistant project
        if (project == null) return next(errors.newError(404));

        // Make sure the user is the owner
        if (project.owner != req.decoded.id) {
            return next(errors.newError(403));
        }

        project.remove(function(err, project) {
            if (err) return next(err);
            res.json({"message": "Project Deleted!"});
        });
    });
};

exports.chart = function(req, res, next) {
    Project.findById(req.params.id, function(err, project) {
        if (err) return next(err);
        // Return 404 for a nonexistant project
        if (project == null) return next(errors.newError(404));

        // Check for permissions
        if (project.members.indexOf(req.decoded.id) !== -1) {
            async.parallel([
                // Get the number of backlog tasks
                function(callback) {
                    Task.count({project: project.id, status: 'backlog'}, function(err, backlog) {
                        if (err) callback(err);

                        callback(null, backlog);
                    });
                },

                // Get the number of in-progress tasks
                function(callback) {
                    Task.count({project: project.id, status: 'in-progress'}, function(err, inprogress) {
                        if (err) callback(err);

                        callback(null, inprogress);
                    });
                },

                // Get the number of complete tasks
                function(callback) {
                    Task.count({project: project.id, status: 'complete'}, function(err, complete) {
                        if (err) callback(err);

                        callback(null, complete);
                    });
                }
            ],

            function(err, results) {
                if (err) return next(err);

                var chart_data = {
                    'big_number': {
                        'backlog': results[0],
                        'in-progress': results[1],
                        'complete': results[2]
                    }
                };
                res.json(chart_data);
            });
        }
        else {
            // User is not a member of the project and does not have a right
            // to the data, tell them so.
            return next(errors.newError(403));
        }
    });
};
