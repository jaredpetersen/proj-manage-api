var expect = require('chai').expect;
var should = require('chai').should;
var supertest = require('supertest');
var config = require('../config');
var api = supertest('http://localhost:' + config.apiPort);

describe('Tasks', function(){
    it('Lists all tasks', function(done){
        api.get('/tasks')
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
                // Due
                expect(res.body[0]).to.have.property('due');
                if (res.body[0].due !== null) {
                    expect(res.body[0].due).to.be.a('String');
                }
                // Created
                expect(res.body[0]).to.have.property('created');
                expect(res.body[0].created).to.not.equal(null);
                expect(res.body[0].created).to.be.a('String');
                // Project
                expect(res.body[0]).to.have.property('project');
                expect(res.body[0].project).to.not.equal(null);
                expect(res.body[0].project).to.be.a('String');
                // Owner
                expect(res.body[0]).to.have.property('owner');
            }
            done();
        });
    });

    // Will only pass if there are tasks
    it('Gets a single task', function(done){
        api.get('/tasks/56865afc820d5aed0b52e7ab')
        .set('Accept', 'application/json')
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
            // Created
            expect(res.body).to.have.property('created');
            expect(res.body.created).to.not.equal(null);
            expect(res.body.created).to.be.a('String');
            // Owner
            expect(res.body).to.have.property('owner');
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
