var expect = require('chai').expect;
var should = require('chai').should;
var supertest = require('supertest');
var config = require('../config');
var api = supertest('http://localhost:' + config.apiPort);

describe('Subtasks', function(){
    it('Lists all subtasks', function(done){
        api.get('/subtasks')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
            // Overall
            expect(res.body).to.be.a('Array');
            // When there are subtasks
            if (res.body.length > 0) {
                // Update this when there are actually subtasks
            }
            done();
        });
    });

    // Will only pass if there are subtasks
    it('Gets a single subtask', function(done){
        api.get('/subtasks/55dc1f4e0563198803325a21')
        .set('Accept', 'application/json')
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
