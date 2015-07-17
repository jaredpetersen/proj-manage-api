// =============================================================================
// Package Setup
// =============================================================================
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var mysql      = require('mysql');

// =============================================================================
// Database Models
// =============================================================================
//var Project = require('./models/project');
//var User    = require('./models/user');

// =============================================================================
// Routes
// =============================================================================
var middleware     = require('./routes/middleware');
var projectRoute   = require('./routes/projects');
//var userRoute      = require('./routes/users');
var error          = require('./routes/errors');

// =============================================================================
// Database Connection
// =============================================================================
var pool = mysql.createPool({
    connectionLimit: 100,
    host : '104.237.141.202',
    port         : 3306,
    user         : 'api_user',
    password     : 'BKHzZfzjWb8KCsFc4bPBd2HP',
    database     : 'projmanage'
});
global.pool = pool;

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
//app.use(userRoute);
app.use(error);

// =============================================================================
// Server
// =============================================================================
// Set pretty printing of JSON
// Shouldn't use this in production because it increases the file size,
// leading to worse performance. May just want to do this for the public API.
app.set('json spaces', 2);
// Set the port
var port = process.env.PORT || 80;
// Start the server
app.listen(port);
console.log("Server running on port " + port);
