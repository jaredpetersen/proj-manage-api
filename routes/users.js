var express = require('express');
var router  = express.Router();
var mysql   = require('mysql');

router.route('/users')

    // Register a user
    .post(function(req, res, next) {
        pool.getConnection(function(err, connection) {
            var query = 'Insert into users (username, firstname, lastname, password, created) values (' + pool.escape(req.body.username) + ', ' + pool.escape(req.body.firstname) + ', ' + pool.escape(req.body.lastname) + ', ' + pool.escape(req.body.password) + ', NOW());';
            connection.query(query, function(err, rows, fields) {
                if (err) next(err);
                else {
                    res.json({"message": "Project Created!"});
                    connection.release();
                }
            });
        });
    })

    // Get all of the projects
    .get(function(req, res, next) {
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
    });

router.route('/users/:user_id')

    // Get the user associated with the id
    .get(function(req, res, next) {
        pool.getConnection(function(err, connection) {
            var query = 'Select * from users where id = ' + pool.escape(req.params.user_id) + ';';
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
    })

    // Update the project associated with the id
    .put(function(req, res, next) {
        pool.getConnection(function(err, connection) {
            var query = 'Update users set username = ' + pool.escape(req.body.username) + ', firstname = ' + pool.escape(req.body.firstname) + ', lastname = ' + pool.escape(req.body.lastname) + ', password = ' + pool.escape(req.body.password) + 'where id = ' + pool.escape(req.params.user_id) + ';';
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
    })

    // Delete the user with the assciated id
    .delete(function(req, res, next) {
        pool.getConnection(function(err, connection) {
            var query = 'Delete from users where id = ' + pool.escape(req.params.user_id) + ';';
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
    });

// Catch validation errors, 404s, etc.
router.use(function(err, req, res, next) {
    console.log(err);
    res.status(400).json({"message": "Bad Request"});
});

module.exports = router;
