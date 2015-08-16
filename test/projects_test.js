var expect = require('chai').expect;
var should = require('chai').should;
var supertest = require('supertest');
var config = require('../config');
var api = supertest('http://localhost:' + config.apiPort);

describe('Projects', function(){
    it('Lists all projects', function(done){
        api.get('/projects')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
            // Overall
            expect(res.body).to.be.a('Array');
            if (res.body.length > 0) {
                // Update this later
            }
            done();
        });
    });
});
