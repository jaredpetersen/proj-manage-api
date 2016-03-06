'use strict';

var Project = require('../models/project.js');
var Task = require('../models/task.js');
var errors = require('./errors.js');
var async = require("async");
var mongoose = require('mongoose');
var ObjectID = mongoose.Types.ObjectId;

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

// Still a work in progress
exports.chart = function(req, res, next) {
    Project.findById(req.params.id, function(err, project) {
        if (err) return next(err);
        // Return 404 for a nonexistant project
        if (project == null) return next(errors.newError(404));

        // Check for permissions
        if (project.members.indexOf(req.decoded.id) !== -1) {
            async.parallel([
                // Get the backlog task counts separated out by date
                function(callback) {
                    Task.aggregate(
                        [
                            { $match : { project: ObjectID(project.id) } },
                            { $unwind : '$status' },
                            { $project : {
                                _id: 1,
                                status: '$status.status',
                                status_date: '$status.date'
                              }
                            },
                            { $match : { status: 'backlog' } },
                            { $group : {
                                _id: {
                                    month: { $month: '$status_date' },
                                    day: { $dayOfMonth: '$status_date' },
                                    year: { $year: '$status_date' }
                                },
                                total: {$sum: 1},
                                dt_sample: { $first: "$status_date" }
                              }
                            },
                            { $project : {
                                _id: {
                                  $dateToString: {
                                    format: '%Y-%m-%dT00:00:00.000Z',
                                    date: '$dt_sample'
                                  }
                                },
                                total: '$total'
                              }
                           },
                           { $sort : { _id : 1 } }
                        ],
                    function(err, backlog) {
                        if (err) callback(err);
                        callback(null, backlog);
                    });
                },

                // Get the inprogress task counts separated out by date
                function(callback) {
                    Task.aggregate(
                        [
                            { $match : { project: ObjectID(project.id) } },
                            { $unwind : '$status' },
                            { $project : {
                                _id: 1,
                                status: '$status.status',
                                status_date: '$status.date'
                              }
                            },
                            { $match : { status: 'in-progress' } },
                            { $group : {
                                _id: {
                                    month: { $month: '$status_date' },
                                    day: { $dayOfMonth: '$status_date' },
                                    year: { $year: '$status_date' }
                                },
                                total: {$sum: 1},
                                dt_sample: { $first: "$status_date" }
                              }
                            },
                            { $project : {
                                _id: {
                                  $dateToString: {
                                    format: '%Y-%m-%dT00:00:00.000Z',
                                    date: '$dt_sample'
                                  }
                                },
                                total: '$total'
                              }
                           },
                           { $sort : { _id : 1 } }
                        ],
                    function(err, inprogress) {
                        if (err) callback(err);
                        callback(null, inprogress);
                    });
                },

                // Get the complete task counts separated out by date
                function(callback) {
                    Task.aggregate(
                        [
                            { $match : { project: ObjectID(project.id) } },
                            { $unwind : '$status' },
                            { $project : {
                                _id: 1,
                                status: '$status.status',
                                status_date: '$status.date'
                              }
                            },
                            { $match : { status: 'complete' } },
                            { $group : {
                                _id: {
                                    month: { $month: '$status_date' },
                                    day: { $dayOfMonth: '$status_date' },
                                    year: { $year: '$status_date' }
                                },
                                total: {$sum: 1},
                                dt_sample: { $first: "$status_date" }
                              }
                            },
                            { $project : {
                                _id: {
                                  $dateToString: {
                                    format: '%Y-%m-%dT00:00:00.000Z',
                                    date: '$dt_sample'
                                  }
                                },
                                total: '$total'
                              }
                           },
                           { $sort : { _id : 1 } }
                        ],
                    function(err, complete) {
                        if (err) callback(err);
                        callback(null, complete);
                    });
                }


            ],

            function(err, results) {
                if (err) return next(err);

                var chart_data = {
                    'historical_status': {
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
