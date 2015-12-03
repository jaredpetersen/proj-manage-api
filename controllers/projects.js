'use strict';

var Project = require('../models/project.js');
var errors = require('./errors.js');

// Get all projects
exports.findAll = function(req, res, next) {
    Project.find({owner: req.decoded.id}, '-__v', function(err, projects) {
        if (err) return next(err);
        res.json(projects);
    });
};

// Get a specific project
exports.findById = function(req, res, next) {
    Project.find({_id: req.params.id, members: {$in: [req.decoded.id]} }, '-__v', function(err, project) {
        if (err) return next(err);
        // Return 404 for a nonexistant project
        if (project == null) return next(errors.newError(404));
        res.json(project);
    });
};

// Add a new project
exports.add = function(req, res, next) {
    var newProject = new Project();
    newProject.name = req.body.name;
    newProject.description = req.body.description || null;
    newProject.owner = req.decoded.id;
    newProject.members = req.decoded.id;
    newProject.save(function(err, newUser) {
        if (err) return next(err);
        res.status(201).json({"message": "Project Created!"});
    });
};

// Update a specific project
exports.update = function(req, res, next) {
    Project.findById(req.params.id, function(err, project) {
        if (err) return next(err);
        // Return 404 for a nonexistant project
        if (project == null) return next(errors.newError(404));
        project.name = req.body.name;
        project.description = req.body.description;
        project.owner = req.body.owner;
        project.save(function(err, project) {
            if (err) return next(err);
            res.json({"message": "Project Updated!"});
        });
    });
};

// Delete a specific project
exports.delete = function(req, res, next) {
    // Can't use findByIdAndRemove() or Model.remove() in order to invoke
    // the middleware; Have to remove a specific document
    Project.findById(req.params.id, function(err, project) {
        if (err) return next(err);
        // Return 404 for a nonexistant user
        if (project == null) return next(errors.newError(404));
        project.remove(function(err, project) {
            if (err) return next(err);
            res.json({"message": "Project Deleted!"});
        });
    });
};
