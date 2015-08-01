'use strict';

module.exports = function (app) {

    // Middleware
    var middleware = require('./controllers/middleware');
    app.use(middleware.logEverything);

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
    app.post('/users', users.add);
    app.put('/users/:id', users.update);
    app.delete('/users/:id', users.delete);

    // Error Handling
    var errors = require('./controllers/errors');
    app.use(errors.errorHandler);
};
