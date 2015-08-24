var expect = require('chai').expect;
var should = require('chai').should;
var supertest = require('supertest');
var config = require('../config');
var api = supertest('http://localhost:' + config.apiPort);

describe('Tasks', function(){
    it('Lists all tasks', function(done){
        api.get('/tasks')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
            // Overall
            expect(res.body).to.be.a('Array');
            // When there are tasks
            if (res.body.length > 0) {
                // Update this when there are actually projects
            }
            done();
        });
    });

    // Will only pass if there are tasks
    it('Gets a single task', function(done){
        api.get('/tasks/55dac88d285b86d51966a18d')
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
            expect(res.body.description).to.not.equal(null);
            expect(res.body.description).to.be.a('String');
            // Created
            expect(res.body).to.have.property('created');
            expect(res.body.created).to.not.equal(null);
            expect(res.body.created).to.be.a('String');
            // Owner
            expect(res.body).to.have.property('owner');
            expect(res.body.owner).to.not.equal(null);
            expect(res.body.owner).to.be.a('String');
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
