'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var subtaskSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String},
    created: {type: Date, default: Date.now},
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
    project: {type : Schema.Types.ObjectId, ref: 'Project', required: true},
    task: {type: Schema.Types.ObjectId, ref: 'Task', required: true}
});

var Subtask = mongoose.model('Subtask', subtaskSchema);
module.exports = Subtask;
