'use strict';

var mysql = require('mysql');

// Get all projects
exports.findAll = function(req, res, next) {
    pool.getConnection(function(err, connection) {
        connection.query('Select * from projects;', function(err, rows, fields) {
            // Check for errors
            if (err) {
                connection.release();
                next(err);
            }
            // Return the projects
            else {
                res.json(rows);
                connection.release();
            }
        });
    });
};

// Get a specific project
exports.findById = function(req, res, next) {
    pool.getConnection(function(err, connection) {
        var query = 'Select * from projects where id = ' + pool.escape(req.params.id) + ';';
        connection.query(query, function(err, rows, fields) {
            // Check for errors
            if (err) {
                connection.release();
                next(err);
            }
            // Check if there are any users
            else if (rows.length > 0) {
                res.json(rows);
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
        var query = 'Insert into projects (name, description, created, owner) values (' + pool.escape(req.body.name) + ', ' + pool.escape(req.body.description) + ', NOW(),' + pool.escape(req.body.userid) + ');';
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
        var query = 'Update projects set name = ' + pool.escape(req.body.name) + ', description = ' + pool.escape(req.body.description) + ', owner = ' + pool.escape(req.body.userid) + 'where id = ' + pool.escape(req.params.id) + ';';
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
        var query = 'Delete from projects where id = ' + pool.escape(req.params.id) + ';';
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
