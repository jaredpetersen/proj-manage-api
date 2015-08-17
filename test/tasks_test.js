var expect = require('chai').expect;
var should = require('chai').should;
var supertest = require('supertest');
var config = require('../config');
var api = supertest('http://localhost:' + config.apiPort);

describe('Subtasks', function(){
    it('Lists all tasks', function(done){
        api.get('/tasks')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
            // Overall
            expect(res.body).to.be.a('Array');
            // When there are projects
            if (res.body.length > 0) {
                // Update this when there are actually projects
            }
            done();
        });
    });

    // Will only pass if there are users
    it('Gets a single task', function(done){
        api.get('/tasks/1')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
            // Overall
            expect(res.body).to.be.a('Object');
            // Project ID
            expect(res.body).to.have.property("id");
            expect(res.body.id).to.not.equal(null);
            expect(res.body.id).to.be.a('Number');
            // Name
            expect(res.body).to.have.property("name");
            expect(res.body.name).to.not.equal(null);
            expect(res.body.name).to.be.a('String');
            // Description
            expect(res.body).to.have.property("description");
            expect(res.body.description).to.not.equal(null);
            expect(res.body.description).to.be.a('String');
            // Created
            expect(res.body).to.have.property("created");
            expect(res.body.created).to.not.equal(null);
            expect(res.body.created).to.be.a('String');
            // Owner
            expect(res.body).to.have.property("owner");
            expect(res.body.owner).to.not.equal(null);
            expect(res.body.owner).to.be.a('Number');
            // Parent Task
            expect(res.body).to.have.property("parent_task");
            expect(res.body.parent_task).to.not.equal(null);
            expect(res.body.parent_task).to.be.a('Number');
            done();
        });
    });

    it('Gets a single (nonexistent) subtask', function(done){
        api.get('/tasks/0')
        .set('Accept', 'application/json')
        .expect(404)
        .end(function(err, res) {
            // Overall
            expect(res.body).to.be.a('Object');
            // Project ID
            expect(res.body).to.have.property("message");
            expect(res.body.message).to.not.equal(null);
            expect(res.body.message).to.be.a('String');
            expect(res.body.message).to.equal('Not Found');
            done();
        });
    });
});