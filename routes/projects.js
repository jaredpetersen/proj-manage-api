var express = require('express');
var router  = express.Router();
var mysql   = require('mysql');

router.route('/projects')

    // Create a project (accessed at POST http://localhost:8087/projects)
    .post(function(req, res, next) {
        pool.getConnection(function(err, connection) {
            var query = 'Insert into projects (name, description, created) values (' + pool.escape(req.body.name) + ', ' + pool.escape(req.body.description) + ', NOW());';
            connection.query(query, function(err, rows, fields) {
                if (err) next(err);
                else {
                    res.json({"message": "Project Created!"});
                    connection.release();
                }
            });
        });
    })

    // Get all of the projects (accessed at GET http://localhost:8087/projects)
    .get(function(req, res, next) {
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
    });

router.route('/projects/:project_id')

    // Get the project associated with the id (accessed at GET http://localhost:8087/projects/:project_id)
    // Make sure to remove the API version from the output
    .get(function(req, res, next) {
        pool.getConnection(function(err, connection) {
            var query = 'Select * from projects where id = ' + pool.escape(req.params.project_id) + ';';
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

    // Update the project associated with the id (accessed at PUT http://localhost:8087/projects/:project_id)
    .put(function(req, res, next) {
        pool.getConnection(function(err, connection) {
            var query = 'Update projects set name = ' + pool.escape(req.body.name) + ', description = ' + pool.escape(req.body.description) + 'where id = ' + pool.escape(req.params.project_id) + ';';
            connection.query(query, function(err, rows, fields) {
                if (err) {
                    connection.release();
                    next(err);
                }
                if (req.params.project_id == null)
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
    })

    // Delete the project with the assciated id (accessed at DELETE http://localhost:8087/projects/:project_id)
    .delete(function(req, res, next) {
        pool.getConnection(function(err, connection) {
            var query = 'Delete from projects where id = ' + pool.escape(req.params.project_id) + ';';
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
    });

// Catch validation errors, 404s, etc.
router.use(function(err, req, res, next) {
    console.log(err);
    res.status(400).json({"message": "Bad Request"});
});

module.exports = router;
