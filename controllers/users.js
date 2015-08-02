'use strict';

var mysql = require('mysql');

// Get all users
exports.findAll = function(req, res, next) {
    pool.getConnection(function(err, connection) {
        connection.query('CALL all_users()', function(err, rows) {
            // Check for errors
            if (err) {
                connection.release();
                next(err);
            }
            // Return the user
            else {
                res.json(rows[0]);
                connection.release();
            }
        });
    });
};

// Get a specific user
exports.findById = function(req, res, next) {
    pool.getConnection(function(err, connection) {
        var query = 'Select * from users where id = ' + pool.escape(req.params.id) + ';';
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
            // Could not find user
            else {
                connection.release();
                var err = new Error();
                err.status = 404;
                next(err);
            }
        });
    });
};

// Register a user
exports.add = function(req, res, next) {
    pool.getConnection(function(err, connection) {
        var query = 'Insert into users (username, firstname, lastname, password, created) values (' + pool.escape(req.body.username) + ', ' + pool.escape(req.body.firstname) + ', ' + pool.escape(req.body.lastname) + ', ' + pool.escape(req.body.password) + ', NOW());';
        connection.query(query, function(err, rows, fields) {
            // Check for errors
            if (err) {
                connection.release();
                next(err);
            }
            // User was created
            else {
                res.json({"message": "User Registered!"});
                connection.release();
            }
        });
    });
};

// Update a specific user
exports.update = function(req, res, next) {
    pool.getConnection(function(err, connection) {
        var query = 'Update users set username = ' + pool.escape(req.body.username) + ', firstname = ' + pool.escape(req.body.firstname) + ', lastname = ' + pool.escape(req.body.lastname) + ', password = ' + pool.escape(req.body.password) + 'where id = ' + pool.escape(req.params.id) + ';';
        connection.query(query, function(err, rows, fields) {
            // Check for errors
            if (err) {
                connection.release();
                next(err);
            }
            // Check if a user was updated
            else if (rows["affectedRows"] > 0) {
                res.json({"message": "User Updated!"});
                connection.release();
            }
            // User does not exist
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
        var query = 'Delete from users where id = ' + pool.escape(req.params.id) + ';';
        connection.query(query, function(err, rows, fields) {
            // Check for errors
            if (err) {
                connection.release();
                next(err);
            }
            // Check if a user was deleted
            else if (rows["affectedRows"] > 0) {
                res.json({"message": "User Deleted!"});
                connection.release();
            }
            // User does not exist
            else {
                connection.release();
                var err = new Error();
                err.status = 404;
                next(err);
            }
        });
    });
};
