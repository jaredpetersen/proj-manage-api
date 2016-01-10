'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var idValidator = require('mongoose-id-validator');

var subtaskSchema = new mongoose.Schema({
    name: {type: String, required: true},
    created: {type: Date, default: Date.now},
    due: {type: Date, required: true},
    task: {type: Schema.Types.ObjectId, ref: 'Task', required: true}
});

subtaskSchema.plugin(idValidator);

var Subtask = mongoose.model('Subtask', subtaskSchema);
module.exports = Subtask;
