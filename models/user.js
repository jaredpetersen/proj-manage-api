var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var UserSchema = new Schema({
    // Look into required fields further
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    firstname: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);
