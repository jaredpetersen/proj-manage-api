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
    app.get('/projects', authenticate.verify, projects.findAll);
    app.get('/projects/:id', authenticate.verify, projects.findById);
    app.post('/projects', authenticate.verify, projects.add);
    app.put('/projects/:id', projects.update); // Need to lock down
    app.delete('/projects/:id', projects.delete); // Need to lock down

    // Tasks
    var tasks = require('./controllers/tasks');
    app.get('/tasks', authenticate.verify, tasks.findAll);
    app.get('/projects/:id/tasks/', authenticate.verify, tasks.findProjectTasks);
    app.get('/projects/:pid/tasks/:tid', authenticate.verify, tasks.findById);
    app.post('/projects/:pid/tasks', authenticate.verify, tasks.add);
    app.put('/tasks/:id', authenticate.verify, tasks.update);
    app.delete('/tasks/:id', authenticate.verify, tasks.delete);

    // Subasks
    var subtasks = require('./controllers/subtasks');
    app.get('/projects/:pid/tasks/:tid/subtasks', authenticate.verify, subtasks.findAll);
    app.get('/projects/:pid/tasks/:tid/subtasks/:sid', authenticate.verify, subtasks.findById);
    app.post('/projects/:pid/tasks/:tid/subtasks/', authenticate.verify, subtasks.add);
    app.put('/projects/:pid/tasks/:tid/subtasks/:sid', authenticate.verify, subtasks.update);
    app.delete('/projects/:pid/tasks/:tid/subtasks/:sid', authenticate.verify, subtasks.delete);

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
