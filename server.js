'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var config = require('./config');
require('./routes')(app);

// Database connection
var pool = mysql.createPool({
    connectionLimit: config.dbConnLimit,
    host: config.dbHost,
    port: config.dbPort,
    user: config.dbUser,
    password: config.dbPass,
    database: config.dbName
});
global.pool = pool;

// BodyParser allows us to get data out of URLs
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// PrettyPrint the JSON output
app.set('json spaces', 2);

// Start the server
app.listen(config.apiPort);
console.log("Server running on port " + config.apiPort);
