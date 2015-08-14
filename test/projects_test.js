var expect = require('chai').expect();
var supertest = require('supertest');
var config = require('../config');
var api = supertest('http://localhost:' + config.apiPort);

describe('Projects', function(){
  it('GET Projects (HTTP 200)', function(done){
    api.get('/projects')
       .expect(200, done);
  });
});
