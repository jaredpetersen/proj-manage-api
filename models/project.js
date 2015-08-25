'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Task = require('./task.js');
var Subtask = require('./subtask.js');

var projectSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String},
    created: {type: Date, default: Date.now},
    owner: {type : Schema.Types.ObjectId, ref: 'User', required: true},
    members: [{type : Schema.Types.ObjectId, ref: 'User', required: true}]
});

// Provides our cascading delete functionality
projectSchema.pre('remove', function(next) {
    Task.remove({owner: this._id}).exec();
    Subtask.remove({owner: this._id}).exec();
});

var Project = mongoose.model('Project', projectSchema);
module.exports = Project;
