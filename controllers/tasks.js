'use strict';

var Task = require('../models/task.js');

// Get all tasks
exports.findAll = function(req, res, next) {
    Task.find().select('-__v').exec(function(err, tasks) {
        if (err) return next(err);
        res.json(tasks);
    });
};

// Get a specific task
exports.findById = function(req, res, next) {
    Task.findById(req.params.id)
    .select('-__v')
    .exec(function(err, project) {
        if (err) return next(err);
        res.json(project);
    });
};

// Add a new task
exports.add = function(req, res, next) {
    pool.getConnection(function(err, connection) {
        var query = 'INSERT INTO projmanage.tasks (name, description, ' +
                    'created, owner, parent_project) VALUES (' +
                    pool.escape(req.body.name) + ', ' +
                    pool.escape(req.body.description) + ', ' +
                    'NOW(), ' + pool.escape(req.body.owner) + ', ' +
                    pool.escape(req.body.parent_project) + ');';
        connection.query(query, function(err, rows, fields) {
            // Check for errors
            if (err) {
                connection.release();
                next(err);
            }
            // task was created
            else {
                res.status(201).json({"message": "Task Created!"});
                connection.release();
            }
        });
    });
};

// Update a specific task
exports.update = function(req, res, next) {
    pool.getConnection(function(err, connection) {
        var query = 'UPDATE projmanage.tasks SET name = ' +
                    pool.escape(req.body.name) + ', description = ' +
                    pool.escape(req.body.description) + ', owner = ' +
                    pool.escape(req.body.owner) + ', parent_project = ' +
                    pool.escape(req.body.parent_project) + ' WHERE id = ' +
                    pool.escape(req.params.id) + ';';
        connection.query(query, function(err, rows, fields) {
            // Check for errors
            if (err) {
                connection.release();
                next(err);
            }
            // Check if the task was updated
            else if (rows["affectedRows"] > 0) {
                res.json({"message": "Task Updated!"});
                connection.release();
            }
            // task does not exist
            else {
                connection.release();
                var err = new Error();
                err.status = 404;
                next(err);
            }
        });
    });
};

// Delete a specific task
exports.delete = function(req, res, next) {
    pool.getConnection(function(err, connection) {
        var query = 'DELETE FROM projmanage.tasks WHERE id = ' +
                    pool.escape(req.params.id) + ';';
        connection.query(query, function(err, rows, fields) {
            // Check for errors
            if (err) {
                connection.release();
                next(err);
            }
            // Check if a task was deleted
            else if (rows["affectedRows"] > 0) {
                res.json({"message": "Task Deleted!"});
                connection.release();
            }
            // task does not exist
            else {
                connection.release();
                var err = new Error();
                err.status = 404;
                next(err);
            }
        });
    });
};
