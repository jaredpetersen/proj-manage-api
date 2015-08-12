'use strict';

var mysql = require('mysql');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var config = require('../config');

// Authenticate the user
exports.login = function(req, res, next) {
    pool.getConnection(function(err, connection) {
        // Make sure the email is included in the request, since the database
        // won't kick us out for a null parameter in a SELECT statement
        if (req.body.email == null) {
            connection.release();
            var err = new Error();
            err.status = 400;
            next(err);
        }
        else {
            // Email addresses are unique, so no worries there
            var query = 'Select password from users where email = ' +
                        pool.escape(req.body.email) + ';';
            connection.query(query, function(err, rows, fields) {
                if (err) {
                    connection.release();
                    next(err);
                }
                else {
                    // Make sure only one result is brought up and that the
                    // passwords match
                    if (rows.length == 1 &&
                        bcrypt.compareSync(req.body.password,
                                           rows[0].password)) {
                        // Create the JSON token
                        var token = jwt.sign(
                            {"email": req.body.email,
                             "password": req.body.password},
                            config.tokenSecret,
                            {
                                // Expire in 24 hours
                                expiresInMinutes: config.tokenExpiration
                            }
                        );
                        // Return the information including token as JSON
                        res.json({
                          "message": "User Authenticated!",
                          "token": token
                        });
                        connection.release();
                    }
                    else {
                        // User did not input correct email/password combo
                        connection.release();
                        var err = new Error();
                        err.status = 401;
                        next(err);
                    }
                }
            });
        }
    });
};
