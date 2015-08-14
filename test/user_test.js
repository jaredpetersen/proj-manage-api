var expect = require('chai').expect;
var supertest = require('supertest');
var config = require('../config');
var api = supertest('http://localhost:' + config.apiPort);

describe('Users', function(){
  it('GET Users (HTTP 200)', function(done){
    api.get('/users')
       .set('Accept', 'application/json')
       .expect(200, done);
  });

  it('GET Single User (HTTP 200)', function(done){
    api.get('/users/4')
       .set('Accept', 'application/json')
       .expect(200)
       .end(function(err, res) {
           expect(res.body).to.have.property("id");
           expect(res.body.id).to.not.equal(null);
           expect(res.body).to.have.property("email");
           expect(res.body.email).to.not.equal(null);
           expect(res.body).to.have.property("firstname");
           expect(res.body.firstname).to.not.equal(null);
           expect(res.body).to.have.property("lastname");
           expect(res.body.lastname).to.not.equal(null);
           expect(res.body).to.have.property("created");
           done();
       });
  });
});
