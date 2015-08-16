'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var FileStreamRotator = require('file-stream-rotator');
var fs = require('fs');
var morgan = require('morgan');
var logDirectory = __dirname + '/log';
var mysql = require('mysql');
var config = require('./config');

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

// Log all requests in a daily log file
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
var accessLogStream = FileStreamRotator.getStream({
  filename: logDirectory + '/access-%DATE%.log',
  frequency: 'daily',
  date_format: "YYYYMMDD",
  verbose: false
});
app.use(morgan('combined', {stream: accessLogStream}));

// Add in the routes
require('./routes')(app);

// PrettyPrint the JSON output
// app.set('json spaces', 2);

// Start the server
app.listen(config.apiPort);
console.log("Server running on port " + config.apiPort);
