var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var ProjectSchema = new Schema({
    // Look into required fields further
    name:  {type: String, required: true, trim: true}
});

module.exports = mongoose.model('Project', ProjectSchema);
