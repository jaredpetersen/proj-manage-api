'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Project = require('./project.js');
var Task = require('./task.js');
var Subtask = require('./subtask.js');

var userSchema = new Schema({
    email: {type: String, required: true},
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    password: {type: String, required: true},
    created: {type: Date, default: Date.now}
});

// Update user references in database when a user is deleted
userSchema.pre('remove', function (next) {
    // Remove models with this user as the owner
    Project.remove({owner: this._id}).exec();
    Task.remove({owner: this._id}).exec();
    Subtask.remove({owner: this._id}).exec();
    // Update members to reflect the new change
    Project.update({members: this._id},
                   {'$pullAll': {members: [this._id]}},
                   {multi: true}).exec();
    next();
});

var User = mongoose.model('User', userSchema);
module.exports = User;
