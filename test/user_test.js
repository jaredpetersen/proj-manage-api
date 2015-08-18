var expect = require('chai').expect;
var should = require('chai').should;
var supertest = require('supertest');
var config = require('../config');
var api = supertest('http://localhost:' + config.apiPort);

describe('Users', function(){
    it('Lists all users', function(done){
        api.get('/users')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
            // Overall
            expect(res.body).to.be.a('Array');
            // When there are users
            if (res.body.length > 0) {
                // User ID
                expect(res.body[0]).to.have.property("id");
                expect(res.body[0].id).to.not.equal(null);
                expect(res.body[0].id).to.be.a('Number');
                // Email
                expect(res.body[0]).to.have.property("email");
                expect(res.body[0].email).to.not.equal(null);
                expect(res.body[0].email).to.be.a('String');
                // First Name
                expect(res.body[0]).to.have.property("firstname");
                expect(res.body[0].firstname).to.not.equal(null);
                expect(res.body[0].firstname).to.be.a('String');
                // Last Name
                expect(res.body[0]).to.have.property("lastname");
                expect(res.body[0].lastname).to.not.equal(null);
                expect(res.body[0].lastname).to.be.a('String');
                // Created
                expect(res.body[0]).to.have.property("created");
                expect(res.body[0].created).to.not.equal(null);
                expect(res.body[0].created).to.be.a('String');
            }
            done();
        });
    });

    it('Gets a single user', function(done){
        api.get('/users/4')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
            // Overall
            expect(res.body).to.be.a('Object');
            // User ID
            expect(res.body).to.have.property("id");
            expect(res.body.id).to.not.equal(null);
            expect(res.body.id).to.be.a('Number');
            // Email
            expect(res.body).to.have.property("email");
            expect(res.body.email).to.not.equal(null);
            expect(res.body.email).to.be.a('String');
            // First Name
            expect(res.body).to.have.property("firstname");
            expect(res.body.firstname).to.not.equal(null);
            expect(res.body.firstname).to.be.a('String');
            // Last Name
            expect(res.body).to.have.property("lastname");
            expect(res.body.lastname).to.not.equal(null);
            expect(res.body.lastname).to.be.a('String');
            // Created
            expect(res.body).to.have.property("created");
            expect(res.body.created).to.not.equal(null);
            expect(res.body.created).to.be.a('String');
            done();
        });
    });

    it('Gets a single (nonexistent) user', function(done){
        api.get('/users/0')
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

    it('Creates a new user');

    it('Updates a user');

    it('Deletes a user');
});
