'use strict';

var mysql = require('mysql');

// Get all tasks
exports.findAll = function(req, res, next) {
    var query = 'SELECT id, name, description, created, owner FROM ' +
                'projmanage.tasks;';
    pool.getConnection(function(err, connection) {
        connection.query(query, function(err, rows) {
            // Check for errors
            if (err) {
                connection.release();
                next(err);
            }
            // Return the tasks
            else {
                res.json(rows);
                connection.release();
            }
        });
    });
};

// Get a specific task
exports.findById = function(req, res, next) {
    var query = 'SELECT id, name, description, created, owner FROM ' +
                'projmanage.tasks WHERE id = ' +
                pool.escape(req.params.id) + ';';
    pool.getConnection(function(err, connection) {
        connection.query(query, function(err, rows) {
            // Check for errors
            if (err) {
                connection.release();
                next(err);
            }
            // Check if there are any users
            else if (rows.length > 0) {
                // Return the task
                res.json(rows[0]);
                connection.release();
            }
            // No task with that ID exists
            else {
                connection.release();
                var err = new Error();
                err.status = 404;
                next(err);
            }
        });
    });
};

// Add a new task
exports.add = function(req, res, next) {
    pool.getConnection(function(err, connection) {
        var query = 'INSERT INTO projmanage.tasks (name, description, ' +
                    'created, owner) VALUES (' +
                    pool.escape(req.body.name) + ', ' +
                    pool.escape(req.body.description) + ', ' +
                    'NOW(), ' + pool.escape(req.body.owner) + ');';
        connection.query(query, function(err, rows, fields) {
            // Check for errors
            if (err) {
                connection.release();
                next(err);
            }
            // task was created
            else {
                res.json({"message": "Task Created!"});
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
                    pool.escape(req.body.owner) + ' WHERE id = ' +
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
