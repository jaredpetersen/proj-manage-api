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
            var query = 'Select id, firstname, lastname, password from ' +
                        'users where email = ' +
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
                        console.log(rows);
                        // Create the JSON token
                        // Look into adding a JTI in the future for additional
                        // security
                        var token = jwt.sign(
                            {"email": req.body.email,
                             "firstname": rows[0].firstname,
                             "lastname": rows[0].lastname,
                             "id": rows[0].id},
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

// Check if the user is Authenticated
// Not actually part of a normal route
exports.verify = function(req, res, next) {
    // Grab the JSONWebToken
    var token = req.body.token ||
                req.query.token ||
                req.headers['x-access-token'];

    // Decode the token if it exists
    if (token) {
        // Verify the token
        jwt.verify(token, config.tokenSecret, function(err, decoded) {
          if (err) {
              // Something went wrong here (likely expired token) so just tell
              // the user that they need to re-authenticate
              var err = new Error();
              err.status = 401;
              next(err);
          }
          else {
            // Everything is good, send along the decoded token so that other
            // requests can pick up the data if necessary
            req.decoded = decoded;
            next();
          }
        });
    }
    else {
        var err = new Error();
        err.status = 401;
        next(err);
    }
};
