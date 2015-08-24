'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var taskSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String},
    created: {type: Date, default: Date.now},
    owner: {type : Schema.Types.ObjectId, ref: 'User'}
});

var Task = mongoose.model('Task', taskSchema);
module.exports = Task;
