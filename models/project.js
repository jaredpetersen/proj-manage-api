'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Task = require('./task.js');
var idValidator = require('mongoose-id-validator');

var projectSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String},
    created: {type: Date, default: Date.now},
    owner: {type : Schema.Types.ObjectId, ref: 'User', required: true},
    members: [{type : Schema.Types.ObjectId, ref: 'User', required: true}]
});

// Provides our cascading delete functionality
projectSchema.pre('remove', function(next) {
    Task.remove({project: this._id}, function(err, removed) {
        next();
    });
});

projectSchema.plugin(idValidator);

var Project = mongoose.model('Project', projectSchema);
module.exports = Project;
