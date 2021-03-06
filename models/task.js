'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Subtask = require('./subtask.js');
var idValidator = require('mongoose-id-validator');

var taskSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String},
    created: {type: Date, default: Date.now},
    due: {type: Date},
    owner: {type : Schema.Types.ObjectId, ref: 'User'},
    status: [
              {
                // Have to include this as a non-selectable field so that it
                // won't show up in the output
                _id: {type: Schema.Types.ObjectId, select: false},
                status: {type: String, lowercase: true},
                date: {type: Date}
              }
            ],
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
