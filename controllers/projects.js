'use strict';

var mysql = require('mysql');

// Get all projects
exports.findAll = function(req, res, next) {
    var query = 'SELECT id, username, firstname, lastname, created FROM ' +
                'projmanage.users;';
    pool.getConnection(function(err, connection) {
        connection.query(query, function(err, rows) {
            // Check for errors
            if (err) {
                connection.release();
                next(err);
            }
            // Return the projects
            else {
                res.json(rows[0]);
                connection.release();
            }
        });
    });
};

// Get a specific project
exports.findById = function(req, res, next) {
    var query = 'SELECT id, name, description, created, owner FROM ' +
                'projmanage.projects WHERE id = ' +
                pool.escape(req.params.id) + ';';
    pool.getConnection(function(err, connection) {
        connection.query(query, function(err, rows) {
            // Check for errors
            if (err) {
                connection.release();
                next(err);
            }
            // Check if there are any users
            else if (rows[0].length > 0) {
                res.json(rows[0]);
                connection.release();
            }
            // Return the project
            else {
                connection.release();
                var err = new Error();
                err.status = 404;
                next(err);
            }
        });
    });
};

// Add a new project
exports.add = function(req, res, next) {
    pool.getConnection(function(err, connection) {
        var query = 'INSERT INTO projmanage.projects (name, description, ' +
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
            // Project was created
            else {
                res.json({"message": "Project Created!"});
                connection.release();
            }
        });
    });
};

// Update a specific project
exports.update = function(req, res, next) {
    pool.getConnection(function(err, connection) {
        var query = 'UPDATE projmanage.projects SET name = ' +
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
            // Check if the project was updated
            else if (rows["affectedRows"] > 0) {
                res.json({"message": "Project Updated!"});
                connection.release();
            }
            // Project does not exist
            else {
                connection.release();
                var err = new Error();
                err.status = 404;
                next(err);
            }
        });
    });
};

// Delete a specific project
exports.delete = function(req, res, next) {
    pool.getConnection(function(err, connection) {
        var query = 'DELETE FROM projmanage.projects WHERE id = ' +
                    pool.escape(req.params.id) + ';';
        connection.query(query, function(err, rows, fields) {
            // Check for errors
            if (err) {
                connection.release();
                next(err);
            }
            // Check if a project was deleted
            else if (rows["affectedRows"] > 0) {
                res.json({"message": "Project Deleted!"});
                connection.release();
            }
            // Project does not exist
            else {
                connection.release();
                var err = new Error();
                err.status = 404;
                next(err);
            }
        });
    });
};
