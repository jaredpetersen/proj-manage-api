var Project = require('../models/project');
var User = require('../models/user');
var express = require('express');
var router = express.Router();

router.route('/projects')

    // Create a project (accessed at POST http://localhost:8087/projects)
    .post(function(req, res, next) {
        // New project instance based on the project model
        var project = new Project();
        project.name = req.body.name;
        project.description = req.body.description;
        var user = User.findById(req.body.user_id, function(err, user) {
            if (err) { next(err); }
            else { return user; }
        });

        // Make sure the user exists
        if (user == null) { next(err); }
        else {
            // User exists
            project.user_id = req.body.user_id;

            // Save the project and check for errors
            project.save(function(err) {
                if (err) { next(err); }
                else { res.json({ message: 'Project created!' }); }
            });
        }
    })

    // Get all of the projects (accessed at GET http://localhost:8087/projects)
    .get(function(req, res, next) {
        Project.find(function(err, projects) {
            if (err) { next(err); }
            else { res.json(projects); }
        }).select('-__v');
    });

router.route('/projects/:project_id')

    // Get the project associated with the id (accessed at GET http://localhost:8087/projects/:project_id)
    // Make sure to remove the API version from the output
    .get(function(req, res, next) {
        Project.findById(req.params.project_id, function(err, project) {
            if (err) { next(err); }
            else { res.json(project); }
        }).select('-__v');
    })

    // Update the project associated with the id (accessed at PUT http://localhost:8087/projects/:project_id)
    .put(function(req, res, next) {
        // Use the project model to find the desire project
        Project.findById(req.params.project_id, function(err, project) {
            if (err) { next(err); }
            else {
                // Update the project's info
                project.name = req.body.name;
                // Save the project
                project.save(function(err) {
                    if (err) { next(err); }
                    else { res.json({ message: "Project updated!" }); }
                });
            }
        });
    })

    // Delete the project with the assciated id (accessed at DELETE http://localhost:8087/projects/:project_id)
    .delete(function(req, res, next) {
        Project.remove(
            { _id: req.params.project_id },
            function(err, project) {
                if (err) { next(err); }
                else { res.json({ message: "Project deleted!" }); }
            }
        );
    });

// Catch validation errors, 404s, etc.
router.use(function(err, req, res, next) {
    console.log(err.name);
    if (err.name == "ValidationError") {
        // User's request didn't match up with the required data
        res.status(400).json({"message": "Bad Request"});
    }
    else if (err.name == "CastError") {
        // Couldn't find the project id
        res.status(404).json({"message": "Not Found"});
    }
    else {
        // Something else went wrong
        res.status(500).json({"message": "Internal Server Error"});
    }
});

module.exports = router;
