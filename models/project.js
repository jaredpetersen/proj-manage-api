'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Task = require('./task.js');

var projectSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String},
    created: {type: Date, default: Date.now},
    owner: {type : Schema.Types.ObjectId, ref: 'User', required: true},
    members: [{type : Schema.Types.ObjectId, ref: 'User', required: true}],
    tasks: [{type : Schema.Types.ObjectId, ref: 'Task'}]
});

// Remove project references in database when a user is deleted
projectSchema.pre('remove', function (next) {
    // Remove all of the associated tasks
    Task.remove({_id: this.tasks}).exec();
    next();
});

var Project = mongoose.model('Project', projectSchema);
module.exports = Project;
