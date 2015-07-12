var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var ProjectSchema = new Schema({
    // Look into required fields further
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: "",
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

module.exports = mongoose.model('Project', ProjectSchema);
