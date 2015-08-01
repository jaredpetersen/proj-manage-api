'use strict';

var mysql = require('mysql');
var jwt = require('jsonwebtoken');
var config = require('../config');

// Authenticate the user
exports.login = function(req, res, next) {
    pool.getConnection(function(err, connection) {
        var query = 'Select username, password from users where username = ' + pool.escape(req.body.username) + 'and password = ' + pool.escape(req.body.password) + ';';
        connection.query(query, function(err, rows, fields) {
            if (err) next(err);
            else {
                if (rows.length == 1 && req.body.username == rows[0].username && req.body.password == rows[0].password) {
                    // Create the JSON token
                    var token = jwt.sign(
                        {"username": req.body.username,
                         "password": req.body.password},
                        config.tokenSecret,
                        {
                            expiresInMinutes: config.tokenExpiration // expires in 24 hours
                        }
                    );
                    // return the information including token as JSON
                    res.json({
                      "message": "User Authenticated!",
                      "token": token
                    });
                }
                else {
                    // User did not input correct username/password combo
                    res.status(401).json({"message": "User Authentication Failed!"});
                }
                connection.release();
            }
        });
    });
};
