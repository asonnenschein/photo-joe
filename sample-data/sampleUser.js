var exec = require('child_process').exec
  , supertest = require('supertest')
;

describe('SlippyNode Image Server REST API Tests', function () {

  var server, agent;

  before(function (done) {
    var cmd = 'createdb -O slippyimages_user slippyimages_db -E utf8';
    cmd += ' && psql -d slippyimages_db -f slippy-images.sql';
    exec(cmd, function (error, stdout, stderr) {
      if (error) throw error;
      if (stderr) throw stderr;
      require('../server')(function (server) {
        server = server;
        agent = supertest.agent(server);
        done();
      });
    });
  });
/*
  after(function () {
    var cmd = 'dropdb slippyimages_db';
    exec(cmd, function (error, stdout, stderr) {
      if (error) throw error;
      if (stderr) throw stderr;
    });
  });
*/
  describe('USER Tests', function () {

    it('POST register a new user account', function (done) {
      var request = {
        "username": "testuser",
        "email": "testuser@test.com",
        "password": "secret"
      };
      agent.post('/users/').send(request).expect(201, done);
    });

    it('POST login to an existing user account', function (done) {
      var request = {
        "username": "testuser",
        "email": "testuser@test.com",
        "password": "secret"
      };
      agent.post('/users/login/').send(request).expect(302, done);
    });

    it('POST upload a new user submission', function (done) {
      agent
        .post('/submissions/')
        .field('title', 'This is a title')
        .field('caption', 'This is a picture of a cute dog.')
        .field('private', 'false')
        .field('anonymous', 'false')
        .attach('file', './sample-data/untitled-0218.jpg')
        .attach('file', './sample-data/untitled-0538.jpg')
        .attach('file', './sample-data/untitled-0774.jpg')
        .attach('file', './sample-data/untitled-1931.jpg')
        .attach('file', './sample-data/untitled-2.jpg')
        .attach('file', './sample-data/untitled-9349.jpg')
        .expect(200, done)
      ;
    });


  });

});