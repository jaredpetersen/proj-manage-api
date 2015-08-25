'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Subtask = require('./subtask.js');

var taskSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String},
    created: {type: Date, default: Date.now},
    owner: {type : Schema.Types.ObjectId, ref: 'User'},
    project: {type : Schema.Types.ObjectId, ref: 'Project', required: true},
});

// Provides our cascading delete functionality
taskSchema.pre('remove', function(next) {
    Subtask.remove({task: this._id}).exec();
});

var Task = mongoose.model('Task', taskSchema);
module.exports = Task;
