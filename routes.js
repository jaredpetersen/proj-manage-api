'use strict';

module.exports = function (app) {

    // Middleware -- Look into this futher
    app.use(function(req, res, next) {
        // Log the requests in the console
        console.log('Client request from ' + req.ip);
        next();
    })

    // Authenticate
    var authenticate = require('./controllers/authenticate');
    app.post('/authenticate', authenticate.login);

    // Projects
    var projects = require('./controllers/projects');
    app.get('/projects', projects.findAll);
    app.get('/projects/:id', projects.findById);
    app.post('/projects', projects.add);
    app.put('/projects/:id', projects.update);
    app.delete('/projects/:id', projects.delete);

    // Users
    var users = require('./controllers/users');
    app.get('/users', users.findAll);
    app.get('/users/:id', users.findById);
    app.put('/users/:id', users.update);
    app.delete('/users/:id', users.delete);

    // Errors -- Look into this further
    // Process 404
    app.use(function(req, res, next) {
        // All non-errors that haven't been handled up until this point are turned
        // into HTTP 404 errors
        res.status(404).json({ "message": "Not Found" });
    });

    // Process Errors
    app.use(function(err, req, res) {
        // All errors that haven't been handled up until this point are turned into
        // HTTP 500 errors
        res.status(500).json({ "message": "Internal Server Error" });
    });
};
