var expect = require('chai').expect;
var should = require('chai').should;
var supertest = require('supertest');
var config = require('../config');
var api = supertest('http://localhost:' + config.apiPort);

describe('Subtasks', function(){
    it('Lists all subtasks', function(done){
        api.get('/projects/56666ee1d83211fe0aa0fac3/tasks/568659d2820d5aed0b52e7a3/subtasks')
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
                // Subtask ID
                expect(res.body[0]).to.have.property('_id');
                expect(res.body[0]._id).to.not.equal(null);
                expect(res.body[0]._id).to.be.a('String');
                // Name
                expect(res.body[0]).to.have.property('name');
                expect(res.body[0].name).to.not.equal(null);
                expect(res.body[0].name).to.be.a('String');
                // Due
                expect(res.body[0]).to.have.property('created');
                expect(res.body[0].created).to.be.a('String');
                // Created
                expect(res.body[0]).to.have.property('created');
                expect(res.body[0].created).to.not.equal(null);
                expect(res.body[0].created).to.be.a('String');
                // Task
                expect(res.body[0]).to.have.property('task');
                expect(res.body[0].task).to.not.equal(null);
                expect(res.body[0].task).to.be.a('String');
            }
            done();
        });
    });

    // Will only pass if there are subtasks
    it('Gets a single subtask', function(done){
        api.get('/projects/56666ee1d83211fe0aa0fac3/tasks/568659d2820d5aed0b52e7a3/subtasks/569215cb2f0a470f52d1055a')
        .set('Accept', 'application/json')
        .set('x-access-token', config.token)
        .expect(200)
        .end(function(err, res) {
            // Overall
            expect(res.body).to.be.a('Object');
            // Subtask ID
            expect(res.body).to.have.property('_id');
            expect(res.body._id).to.not.equal(null);
            expect(res.body._id).to.be.a('String');
            // Name
            expect(res.body).to.have.property('name');
            expect(res.body.name).to.not.equal(null);
            expect(res.body.name).to.be.a('String');
            // Due
            expect(res.body).to.have.property('created');
            expect(res.body.created).to.be.a('String');
            // Created
            expect(res.body).to.have.property('created');
            expect(res.body.created).to.not.equal(null);
            expect(res.body.created).to.be.a('String');
            // Task
            expect(res.body).to.have.property('task');
            expect(res.body.task).to.not.equal(null);
            expect(res.body.task).to.be.a('String');
            done();
        });
    });

    it('Gets a single (nonexistent) subtask', function(done){
        api.get('/subtasks/0')
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

    it('Creates a new subtask');

    it('Updates a subtask');

    it('Deletes a subtask');
});
