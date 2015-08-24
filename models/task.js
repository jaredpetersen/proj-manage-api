'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Subtask = require('./subtask.js');

var taskSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String},
    created: {type: Date, default: Date.now},
    owner: {type : Schema.Types.ObjectId, ref: 'User'},
    subtasks: [{type : Schema.Types.ObjectId, ref: 'Subtask'}]
});

// Remove project references in database when a user is deleted
taskSchema.pre('remove', function (next) {
    // Remove all of the associated tasks
    Subtask.remove({_id: this.subtasks}).exec();
    next();
});

var Task = mongoose.model('Task', taskSchema);
module.exports = Task;
