'use strict';

var mysql   = require('mysql');

// Get all projects
exports.findAll = function(req, res, next) {
    pool.getConnection(function(err, connection) {
        connection.query('Select * from users;', function(err, rows, fields) {
            if (err) {
                connection.release();
                next(err);
            }
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
        var query = 'Select * from users where id = ' + pool.escape(req.params.id) + ';';
        connection.query(query, function(err, rows, fields) {
            if (err) {
                connection.release();
                next(err);
            }
            else {
                // If no results found, return a 404
                if (rows.length == 0) {
                    res.status(404).json({"message": "Not Found"});
                }
                else {
                    res.json(rows);
                }
                connection.release();
            }
        });
    });
};

// Update a specific project
exports.update = function(req, res, next) {
    pool.getConnection(function(err, connection) {
        var query = 'Update users set username = ' + pool.escape(req.body.username) + ', firstname = ' + pool.escape(req.body.firstname) + ', lastname = ' + pool.escape(req.body.lastname) + ', password = ' + pool.escape(req.body.password) + 'where id = ' + pool.escape(req.params.id) + ';';
        connection.query(query, function(err, rows, fields) {
            if (err) {
                connection.release();
                next(err);
            }
            if (req.params.user_id == null)
            {
                res.status(400).json({"message": "Bad Request"});
                connection.release();
            }
            else if (rows["affectedRows"] > 0) {
                res.json({"message": "User Updated!"});
                connection.release();
            }
            else {
                res.status(404).json({"message": "Not Found"});
                connection.release();
            }
        });
    });
};

// Delete a specific project
exports.delete = function(req, res, next) {
    pool.getConnection(function(err, connection) {
        var query = 'Delete from users where id = ' + pool.escape(req.params.id) + ';';
        connection.query(query, function(err, rows, fields) {
            if (err) {
                connection.release();
                next(err);
            }
            if (req.params.user_id == null)
            {
                res.status(400).json({"message": "Bad Request"});
                connection.release();
            }
            else if (rows["affectedRows"] > 0) {
                res.json({"message": "User Deleted!"});
                connection.release();
            }
            else{
                res.status(404).json({"message": "Not Found"});
                connection.release();
            }
        });
    });
};
