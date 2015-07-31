'use strict';

var mysql   = require('mysql');

// Get all projects
exports.findAll = function(req, res, next) {
    pool.getConnection(function(err, connection) {
        connection.query('Select * from projects;', function(err, rows, fields) {
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
        var query = 'Select * from projects where id = ' + pool.escape(req.params.id) + ';';
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

// Add a new project
exports.add = function(req, res, next) {
    pool.getConnection(function(err, connection) {
        var query = 'Insert into projects (name, description, created, owner) values (' + pool.escape(req.body.name) + ', ' + pool.escape(req.body.description) + ', NOW(),' + pool.escape(req.body.userid) + ');';
        connection.query(query, function(err, rows, fields) {
            if (err) next(err);
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
            if (err) {
                connection.release();
                next(err);
            }
            if (req.params.id == null)
            {
                res.status(400).json({"message": "Bad Request"});
                connection.release();
            }
            else if (rows["affectedRows"] > 0) {
                res.json({"message": "Project Updated!"});
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
        var query = 'Delete from projects where id = ' + pool.escape(req.params.id) + ';';
        connection.query(query, function(err, rows, fields) {
            if (err) {
                connection.release();
                next(err);
            }
            else if (rows["affectedRows"] > 0) {
                res.json({"message": "Project Deleted!"});
                connection.release();
            }
            else{
                res.status(404).json({"message": "Not Found"});
                connection.release();
            }
        });
    });
};
