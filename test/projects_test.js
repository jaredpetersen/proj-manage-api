var expect = require('chai').expect;
var should = require('chai').should;
var supertest = require('supertest');
var config = require('../config');
var api = supertest('http://localhost:' + config.apiPort);

describe('Projects', function(){
    it('Lists all projects', function(done){
        api.get('/projects')
        .set('Accept', 'application/json')
        .set('x-access-token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImpwZXRlcnNlbjExQHdvdS5lZHUiLCJpZCI6IjU1ZWJhYjIxMmY4ODUxNTQwZWEwMzk3ZiIsImlhdCI6MTQ0ODQxOTQ4MSwiZXhwIjoxNDQ4NTA1ODgxfQ.sRH3sRjqgSZpAuSvwg5e_C6btKsT6SxDjtb49D34sls')
        .expect(200)
        .end(function(err, res) {
            // Overall
            expect(res.body).to.be.a('Array');
            // When there are projects
            if (res.body.length > 0) {
                // Overall
                expect(res.body[0]).to.be.a('Object');
                // Project ID
                expect(res.body[0]).to.have.property('_id');
                expect(res.body[0]._id).to.not.equal(null);
                expect(res.body[0]._id).to.be.a('String');
                // Name
                expect(res.body[0]).to.have.property('name');
                expect(res.body[0].name).to.not.equal(null);
                expect(res.body[0].name).to.be.a('String');
                // Description
                expect(res.body[0]).to.have.property('description');
                // Created
                expect(res.body[0]).to.have.property('created');
                expect(res.body[0].created).to.not.equal(null);
                expect(res.body[0].created).to.be.a('String');
                // Owner
                expect(res.body[0]).to.have.property('owner');
                expect(res.body[0].owner).to.not.equal(null);
                expect(res.body[0].owner).to.be.a('String');
                // Members
                expect(res.body[0]).to.have.property('members');
                expect(res.body[0].members).to.not.equal(null);
                expect(res.body[0].members).to.be.an('Array');
            }
            done();
        });
    });

    // Will only pass if there are users
    it('Gets a single project', function(done){
        api.get('/projects/55ebab432f8851540ea03981')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
            // Overall
            expect(res.body).to.be.a('Object');
            // Project ID
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
            expect(res.body.owner).to.not.equal(null);
            expect(res.body.owner).to.be.a('String');
            // Members
            expect(res.body).to.have.property('members');
            expect(res.body.members).to.not.equal(null);
            expect(res.body.members).to.be.an('Array');
            done();
        });
    });

    it('Gets a single (nonexistent) project', function(done){
        api.get('/projects/0')
        .set('Accept', 'application/json')
        .expect(404)
        .end(function(err, res) {
            // Overall
            expect(res.body).to.be.a('Object');
            // Project ID
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.not.equal(null);
            expect(res.body.message).to.be.a('String');
            expect(res.body.message).to.equal('Not Found');
            done();
        });
    });

    it('Creates a new project');

    it('Updates a project');

    it('Deletes a project');
});
