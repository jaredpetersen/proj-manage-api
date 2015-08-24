'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var projectSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String},
    created: {type: Date, default: Date.now},
    owner: {type : Schema.Types.ObjectId, ref: 'User', required: true},
    members: [{type : Schema.Types.ObjectId, ref: 'User', required: true}]
});

var Project = mongoose.model('Project', projectSchema);
module.exports = Project;
