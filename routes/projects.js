var Project = require('../models/project');
var express = require('express');
var router = express.Router();

router.route('/projects')

    // Create a project (accessed at POST http://localhost:8080/projects)
    .post(function(req, res, next) {
        // New project instance based on the project model
        var project = new Project();
        project.name = req.body.name;

        // Save the project and check for errors
        project.save(function(err) {
            if (err) { next(err); }
            res.json({ message: 'Project created!' });
        });
    })

    // Get all of the projects (accessed at GET http://localhost:8080/projects)
    .get(function(req, res, next) {
        Project.find(function(err, projects) {
            if (err) { next(err); }
            res.json(projects)
        }).select('-__v');
    });

router.route('/projects/:project_id')

    // get the project associated with the id (accessed at GET http://localhost:8080/projects/:project_id)
    .get(function(req, res, next) {
        Project.findById(req.params.project_id, function(err, project) {
            if (err) { next(err); }
            res.json(project);
        }).select('-__v');
    })

    // update the project associated with the id (accessed at PUT http://localhost:8080/projects/:project_id)
    .put(function(req, res, next) {
        // Use the project model to find the desire project
        Project.findById(req.params.project_id, function(err, project) {
            if (err) { next(err); }
            // Update the project's info
            project.name = req.body.name;
            // Save the project
            project.save(function(err) {
                if (err) { next(err); }
                res.json({ message: "Project updated!" });
            });
        });
    })

    // Delete the project with the assciated id (accessed at DELETE http://localhost:8080/projects/:project_id)
    .delete(function(req, res, next) {
        Project.remove({
            _id: req.params.project_id
        }, function(err, project) {
            if (err) { next(err); }
            res.json({ message: "Project deleted!" });
        });
    });

// TODO: Look into error processing further, especially when it comes to updating items
// Catch 404s and error message
router.use(function(err, req, res, next) {
    if (res.statusCode == 500) {
        res.status(500).json({"message": "Internal Server Error"});
    }
    else {
        res.status(404).json({"message": "Not Found"});
    }
});

module.exports = router;
