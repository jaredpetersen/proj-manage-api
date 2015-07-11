// =============================================================================
// Package Setup
// =============================================================================
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');

// =============================================================================
// Database Models
// =============================================================================
var Project    = require('./models/project');

// =============================================================================
// Routes
// =============================================================================
var middleware     = require('./routes/middleware');
var projectRoute   = require('./routes/projects');
var error          = require('./routes/errors');

// =============================================================================
// Database Connection
// =============================================================================
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/proj-manage');

// =============================================================================
// bodyParser -- Allows us to get data out of a POST
// =============================================================================
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// =============================================================================
// Register API Routes
// =============================================================================
app.use(middleware);
app.use(projectRoute);
app.use(error);

// =============================================================================
// Server
// =============================================================================
// Set pretty printing of JSON
// Shouldn't use this in production because it increases the file size,
// leading to worse performance. May just want to do this for the public API.
app.set('json spaces', 2);
// Set the port
var port = process.env.PORT || 8086;
// Start the server
app.listen(port);
console.log("Server running on port " + port);
