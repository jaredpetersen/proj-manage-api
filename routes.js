'use strict';

module.exports = function (app) {

    // Middleware
    var middleware = require('./controllers/middleware');
    app.use(middleware.cors);

    // Authenticate
    var authenticate = require('./controllers/authenticate');
    app.post('/authenticate/', authenticate.login);

    // Projects
    var projects = require('./controllers/projects');
    app.get('/projects', projects.findAll);
    app.get('/projects/:id', projects.findById);
    app.post('/projects', projects.add);
    app.put('/projects/:id', projects.update);
    app.delete('/projects/:id', projects.delete);

    // Tasks
    var tasks = require('./controllers/tasks');
    app.get('/tasks', tasks.findAll);
    app.get('/tasks/:id', tasks.findById);
    app.post('/tasks', tasks.add);
    app.put('/tasks/:id', tasks.update);
    app.delete('/tasks/:id', tasks.delete);

    // Subasks
    var subtasks = require('./controllers/subtasks');
    app.get('/subtasks', subtasks.findAll);
    app.get('/subtasks/:id', subtasks.findById);
    app.post('/subtasks', subtasks.add);
    app.put('/subtasks/:id', subtasks.update);
    app.delete('/subtasks/:id', subtasks.delete);

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
    app.use(errors.nullRoute); // Requested route doesn't exist

    // To add authentication to a route, add a authenticate.verify to the
    // parameters of the HTTP request. For example, if you want to lock down
    // HTTP GET requests on /users, you would implement the following code:
    //     app.get('/users', authenticate.verify, users.findAll);
};
