'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Subtask = require('./subtask.js');
var idValidator = require('mongoose-id-validator');

var taskSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String},
    created: {type: Date, default: Date.now},
    owner: {type : Schema.Types.ObjectId, ref: 'User'},
    status: {type: String, lowercase: true, default: 'backlog'},
    project: {type : Schema.Types.ObjectId, ref: 'Project', required: true}
});

// Provides our cascading delete functionality
taskSchema.pre('remove', function(next) {
    Subtask.remove({task: this._id}, function(err, removed) {
        next();
    });
});

taskSchema.plugin(idValidator);

var Task = mongoose.model('Task', taskSchema);
module.exports = Task;
