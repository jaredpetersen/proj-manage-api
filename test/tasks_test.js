var expect = require('chai').expect;
var should = require('chai').should;
var supertest = require('supertest');
var config = require('../config');
var api = supertest('http://localhost:' + config.apiPort);

describe('Tasks', function(){
    it('Lists all tasks for a user', function(done){
        api.get('/projects/all/tasks')
        .set('Accept', 'application/json')
        .set('x-access-token', config.token)
        .expect(200)
        .end(function(err, res) {
            // Overall
            expect(res.body).to.be.a('Array');
            // When there are users
            if (res.body.length > 0) {
                // Overall
                expect(res.body[0]).to.be.a('Object');
                // Task ID
                expect(res.body[0]).to.have.property('_id');
                expect(res.body[0]._id).to.not.equal(null);
                expect(res.body[0]._id).to.be.a('String');
                // Name
                expect(res.body[0]).to.have.property('name');
                expect(res.body[0].name).to.not.equal(null);
                expect(res.body[0].name).to.be.a('String');
                // Description
                expect(res.body[0]).to.have.property('description');
                if (res.body[0].description !== null) {
                    expect(res.body[0].description).to.be.a('String');
                }
                // Due
                expect(res.body[0]).to.have.property('due');
                if (res.body[0].due !== null) {
                    expect(res.body[0].due).to.be.a('String');
                }
                // Created
                expect(res.body[0]).to.have.property('created');
                expect(res.body[0].created).to.not.equal(null);
                expect(res.body[0].created).to.be.a('String');
                // Owner
                expect(res.body[0]).to.have.property('owner');
                if (res.body[0].owner !== null) {
                    expect(res.body[0].owner).to.be.a('String');
                }
                // Status
                expect(res.body[0]).to.have.property('status');
                expect(res.body[0].status).to.not.equal(null);
                expect(res.body[0].status).to.be.a('Array');
                expect(res.body[0].status[0]).to.have.property('date');
                expect(res.body[0].status[0].date).to.not.equal(null);
                expect(res.body[0].status[0].date).to.be.a('String');
                expect(res.body[0].status[0]).to.have.property('status');
                expect(res.body[0].status[0].status).to.be.a('String');
                expect(res.body[0].status[0].status).to.equal('backlog');
                // Project
                expect(res.body[0]).to.have.property('project');
                expect(res.body[0].project).to.not.equal(null);
                expect(res.body[0].project).to.be.a('String');
            }
            done();
        });
    });

    // Will only pass if there are tasks
    it('Gets a single task', function(done){
        api.get('/projects/56666ee1d83211fe0aa0fac3/tasks/56c6b0a650bc2dc9b19c27aa')
        .set('Accept', 'application/json')
        .set('x-access-token', config.token)
        .expect(200)
        .end(function(err, res) {
            // Overall
            expect(res.body).to.be.a('Object');
            // Task ID
            expect(res.body).to.have.property('_id');
            expect(res.body._id).to.not.equal(null);
            expect(res.body._id).to.be.a('String');
            // Name
            expect(res.body).to.have.property('name');
            expect(res.body.name).to.not.equal(null);
            expect(res.body.name).to.be.a('String');
            // Description
            expect(res.body).to.have.property('description');
            if (res.body.description !== null) {
                expect(res.body.description).to.be.a('String');
            }
            // Due
            expect(res.body).to.have.property('due');
            if (res.body.due !== null) {
                expect(res.body.due).to.be.a('String');
            }
            // Created
            expect(res.body).to.have.property('created');
            expect(res.body.created).to.not.equal(null);
            expect(res.body.created).to.be.a('String');
            // Owner
            expect(res.body).to.have.property('owner');
            if (res.body.owner !== null) {
                expect(res.body.owner).to.be.a('String');
            }
            // Status
            expect(res.body).to.have.property('status');
            expect(res.body.status).to.not.equal(null);
            expect(res.body.status).to.be.a('Array');
            expect(res.body.status[0]).to.have.property('date');
            expect(res.body.status[0].date).to.not.equal(null);
            expect(res.body.status[0].date).to.be.a('String');
            expect(res.body.status[0]).to.have.property('status');
            expect(res.body.status[0].status).to.be.a('String');
            expect(res.body.status[0].status).to.equal('backlog');
            // Project
            expect(res.body).to.have.property('project');
            expect(res.body.project).to.not.equal(null);
            expect(res.body.project).to.be.a('String');
            done();
        });
    });

    it('Gets a single (nonexistent) task', function(done){
        api.get('/tasks/0')
        .set('Accept', 'application/json')
        .set('x-access-token', config.token)
        .expect(404)
        .end(function(err, res) {
            // Overall
            expect(res.body).to.be.a('Object');
            // Not found message
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.not.equal(null);
            expect(res.body.message).to.be.a('String');
            expect(res.body.message).to.equal('Not Found');
            done();
        });
    });

    it('Creates a new task');

    it('Updates a task');

    it('Deletes a task');
});
