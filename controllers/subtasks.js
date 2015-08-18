'use strict';

var mysql = require('mysql');

// Get all subtasks
exports.findAll = function(req, res, next) {
    var query = 'SELECT id, name, description, created, owner, parent_task ' +
                'FROM projmanage.subtasks;';
    pool.getConnection(function(err, connection) {
        connection.query(query, function(err, rows) {
            // Check for errors
            if (err) {
                connection.release();
                next(err);
            }
            // Return the subtasks
            else {
                res.json(rows);
                connection.release();
            }
        });
    });
};

// Get a specific subtask
exports.findById = function(req, res, next) {
    var query = 'SELECT id, name, description, created, owner, parent_task ' +
                'FROM projmanage.subtasks WHERE id = ' +
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
                // Return the subtask
                res.json(rows[0]);
                connection.release();
            }
            // No subtask with that ID exists
            else {
                connection.release();
                var err = new Error();
                err.status = 404;
                next(err);
            }
        });
    });
};

// Add a new subtask
exports.add = function(req, res, next) {
    pool.getConnection(function(err, connection) {
        var query = 'INSERT INTO projmanage.subtasks (name, description, ' +
                    'created, owner, parent_task) VALUES (' +
                    pool.escape(req.body.name) + ', ' +
                    pool.escape(req.body.description) + ', ' +
                    'NOW(), ' + pool.escape(req.body.owner) + ', ' +
                    pool.escape(req.body.parent_task) + ');';
        connection.query(query, function(err, rows, fields) {
            // Check for errors
            if (err) {
                connection.release();
                next(err);
            }
            // subtask was created
            else {
                res.status(201).json({"message": "Subtask Created!"});
                connection.release();
            }
        });
    });
};

// Update a specific subtask
exports.update = function(req, res, next) {
    pool.getConnection(function(err, connection) {
        var query = 'UPDATE projmanage.subtasks SET name = ' +
                    pool.escape(req.body.name) + ', description = ' +
                    pool.escape(req.body.description) + ', owner = ' +
                    pool.escape(req.body.owner) + ', parent_task = ' +
                    pool.escape(req.body.parent_task) + ' WHERE id = ' +
                    pool.escape(req.params.id) + ';';
        connection.query(query, function(err, rows, fields) {
            // Check for errors
            if (err) {
                connection.release();
                next(err);
            }
            // Check if the subtask was updated
            else if (rows["affectedRows"] > 0) {
                res.json({"message": "Subtask Updated!"});
                connection.release();
            }
            // subtask does not exist
            else {
                connection.release();
                var err = new Error();
                err.status = 404;
                next(err);
            }
        });
    });
};

// Delete a specific subtask
exports.delete = function(req, res, next) {
    pool.getConnection(function(err, connection) {
        var query = 'DELETE FROM projmanage.subtasks WHERE id = ' +
                    pool.escape(req.params.id) + ';';
        connection.query(query, function(err, rows, fields) {
            // Check for errors
            if (err) {
                connection.release();
                next(err);
            }
            // Check if a subtask was deleted
            else if (rows["affectedRows"] > 0) {
                res.json({"message": "Subtask Deleted!"});
                connection.release();
            }
            // subtask does not exist
            else {
                connection.release();
                var err = new Error();
                err.status = 404;
                next(err);
            }
        });
    });
};
