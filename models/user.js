'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Project = require('./project.js');
var Task = require('./task.js');
var Subtask = require('./subtask.js');

var userSchema = new Schema({
    email: {type: String, required: true},
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    password: {type: String, required: true},
    created: {type: Date, default: Date.now}
});

// Provides our cascading delete functionality
userSchema.pre('remove', function(next) {
    // Delete all projects associated with the user
    // Have to do it this way so that the project middleware is called
    Project.find({owner: this._id}, function(err, projects) {
        projects.forEach(function(project) {
            Project.findById(project['_id'], function(err, project) {
                project.remove(function(err, project){});
            })
        });
    });
    Task.remove({owner: this._id}).exec();
    Subtask.remove({owner: this._id}).exec();
    next();
});

var User = mongoose.model('User', userSchema);
module.exports = User;
