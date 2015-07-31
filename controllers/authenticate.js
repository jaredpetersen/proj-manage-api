'use strict';

var mysql   = require('mysql');
var jwt     = require('jsonwebtoken');

// Get all projects
exports.login = function(req, res, next) {
    pool.getConnection(function(err, connection) {
        var query = 'Select username, password from users where username = ' + pool.escape(req.body.username) + 'and password = ' + pool.escape(req.body.password) + ';';
        connection.query(query, function(err, rows, fields) {
            if (err) next(err);
            else {
                if (rows.length == 1 && req.body.username == rows[0].username && req.body.password == rows[0].password) {
                    //res.json({"message": "User Authenticated!"});

                    var token = jwt.sign({"username": req.body.username, "password": req.body.password}, 'supersecret', {
                      expiresInMinutes: 1440 // expires in 24 hours
                    });

                    // return the information including token as JSON
                    res.json({
                      "message": "User Authenticated!",
                      "token": token
                    });

                }
                else {
                    res.status(401).json({"message": "User Authentication Failed!"});
                }
                connection.release();
            }
        });
    });
};
