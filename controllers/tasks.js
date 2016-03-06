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
            // User is not a member of the project and does not have a right
            // to the data, tell them so.
            return next(errors.newError(403));
        }
    });
};

// Get a specific task
exports.findById = function(req, res, next) {
    Project.findById(req.params.pid, '-__v', function(err, project) {
        if (err) return next(err);
        if (project.members.indexOf(req.decoded.id) != -1) {
            // User is a member of the project, let them have the data
            Task.findById(req.params.tid, '-__v', function(err, task) {
                if (err) return next(err);
                // Return 404 for a nonexistant task
                if (task == null) return next(errors.newError(404));
                res.json(task);
            });
        }
        else {
            // User is not a member of the project and does not have a right
            // to the data, tell them so.
            return next(errors.newError(403));
        }
    });

};

// Add a new task
exports.add = function(req, res, next) {
    Project.findById(req.params.pid, '-__v', function(err, project) {
        if (err) return next(err);
        // Return 404 for a nonexistant project
        if (project == null) return next(errors.newError(404));
        // Otherwise, create the task if the user is a member of the project
        if (project.members.indexOf(req.decoded.id) !== -1) {
            var newTask = new Task();
            newTask.name = req.body.name;
            newTask.description = req.body.description || null;
            newTask.due = req.body.due || null;
            newTask.owner = req.body.owner || null;
            // Defaults for arrays don't really work, so we have to resort
            // to adding what we need here
            newTask.status.push({'status': 'backlog', 'date': Date.now()});
            newTask.project = req.params.pid;
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
    Task.findById(req.params.tid, function(err, task) {
        if (err) return next(err);

        // Return 404 for a nonexistent task or if the project and task's
        // project that the user sent us doesn't match up
        if ((task == null) || (req.params.pid != task.project)) {
            console.log('test');
            return next(errors.newError(404));
        }

        // Make sure the user has permission to edit the project associated
        // with the task
        Project.findById(req.params.pid, '-__v', function(err, project) {
            if (err) return next(err);
            // Return 404 for a nonexistent project
            if (project == null) return next(errors.newError(404));

            // Check for permissions
            if (project.members.indexOf(req.decoded.id) !== -1) {
                // Begin a series of checks for items that need to be updated
                // This prevents null values for being sent in for updating
                if (req.body.name !== undefined) {
                    task.name = req.body.name;
                }

                if (req.body.description !== undefined) {
                    task.description = req.body.description;
                }

                if (req.body.due !== undefined) {
                    task.due = req.body.due;
                }

                if (req.body.owner !== undefined) {
                    task.owner = req.body.owner;
                }

                if (req.body.status !== undefined) {
                    var status = req.body.status.toLowerCase();

                    if (status !== 'backlog' && status !== 'in-progress' && status !== 'complete') {
                        // The user inputted a non-acceptable status
                        return next(errors.newError(400));
                    }
                    else if (task.status.length == 0 || status !== task.status[task.status.length - 1].status) {
                        // The status is not the same as last time, go ahead and add it

                        // Set up dates for comparison
                        var prevDate = new Date(task.status[task.status.length - 1].date);
                        prevDate.setHours(0, 0, 0, 0);
                        var newDate = new Date();
                        newDate.setHours(0, 0, 0, 0);

                        // If the user already changed the status today, just make the new change
                        // the one that is recorded
                        if (prevDate.valueOf() === newDate.valueOf())
                        {
                            // Remove the last item so that it can be replaced
                            task.status.pop();
                        }
                        // Add the new status
                        task.status.push({
                            'status': status,
                            'date': Date.now()
                        });
                    }
                }

                // Save the task
                task.save(function(err, task) {
                    if (err) return next(err);
                    res.json({"message": "Task Updated!"});
                });
            }
            else {
                // User is not a member of the task's project, they cannot
                // update the task
                return next(errors.newError(403));
            }
        });
    });
};

// Delete a specific task
exports.delete = function(req, res, next) {
    // Can't use findByIdAndRemove() or Model.remove() in order to invoke
    // the middleware; Have to remove a specific document
    Task.findById(req.params.tid, function(err, task) {
        if (err) return next(err);
        // Return 404 for a nonexistant task
        if (task == null) return next(errors.newError(404));

        // Make sure the user has permission to delete the task
        Project.findById(req.params.pid, '-__v', function(err, project) {
            if (err) return next(err);
            // Return 404 for a nonexistent project
            if (project == null) return next(errors.newError(404));

            // Check for permissions
            if (project.members.indexOf(req.decoded.id) !== -1) {
                // Remove the task
                task.remove(function(err, task) {
                    if (err) return next(err);
                    res.json({"message": "Task Deleted!"});
                });
            }
            else {
                // User is not a member of the task's project, they cannot
                // update the task
                return next(errors.newError(403));
            }
        });
    });
};
