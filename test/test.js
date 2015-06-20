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

  after(function () {
    var cmd = 'dropdb slippyimages_db';
    exec(cmd, function (error, stdout, stderr) {
      if (error) throw error;
      if (stderr) throw stderr;
    });
  });

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
      agent.post('/users/login/').send(request).expect(200, done);
    });

    it('GET a single user', function (done) {
      agent.get('/users/testuser/').expect(200, done);
    });

    it('GET preferences for a single user', function (done) {
      agent.get('/users/testuser/preferences/').expect(200, done);
    });

    it('POST logout of an existing user account', function (done) {
      var request = {
        "username": "testuser",
        "email": "testuser@test.com",
        "password": "secret"
      };
      agent.post('/users/logout/').send(request).expect(200, done);
    });

    it('POST login to an existing user account', function (done) {
      var request = {
        "username": "testuser",
        "email": "testuser@test.com",
        "password": "secret"
      };
      agent.post('/users/login/').send(request).expect(200, done);
    });

    it('PUT changes to a user account', function (done) {
      var request = {
        "username": "testuser2",
        "email": "testuser2@test.com",
        "password": "opensesame"
      };
      agent.put('/users/testuser/').send(request).expect(200, done);
    });

    it('PUT changes to user preferences', function (done) {
      var request = {
        "night_mode": true,
        "bio": "software developer from tucson, az."
      };
      agent.put('/users/testuser/preferences').send(request).expect(200, done);
    });

    it('DELETE a user account', function (done) {
      var request = {
        "username": "testuser2",
        "email": "testuser@test.com",
        "password": "opensesame"
      };
      agent.delete('/users/testuser2/').send(request).expect(200, done);
    });

  });

  describe('SUBMISSIONS Tests', function () {

    var submission;

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
      agent.post('/users/login/').send(request).expect(200, done);
    });

    it('POST upload a new user submission', function (done) {
      agent
        .post('/submissions/')
        .field('title', 'This is a title')
        .field('caption', 'This is a picture of a cute dog.')
        .field('private', 'false')
        .field('anonymous', 'false')
        .attach('file', './test/cutedog.jpg')
        .expect(200, done)
      ;
    });

    it('GET all submissions', function (done) {
      agent
        .get('/submissions/')
        .end(function (error, response) {
          if (error) throw error;
          if (response.status === 200) {
            submission = response.body[0].name;
            done();
          }
        })
      ;
    });

    it('GET a single submission', function (done) {
      agent.get('/submissions/' + submission + '/').expect(200, done);
    });

    it('PUT update a submission', function (done) {
      agent
        .put('/submissions/' + submission + '/')
        .field('title', 'This is an updated title')
        .field('caption', 'This is an updated picture of a cute dog.')
        .field('private', 'false')
        .field('anonymous', 'false')
        .expect(200, done)
      ;
    });

    it('DELETE a submission', function (done) {
      agent.delete('/submissions/' + submission + '/').expect(200, done);
    });

    it('DELETE a user account', function (done) {
      agent.delete('/users/testuser/').expect(200, done);
    });

    it('POST upload a new anonymous submission', function (done) {
      agent
        .post('/submissions/')
        .field('title', 'This is a title')
        .field('caption', 'This is a picture of a cute dog.')
        .field('private', 'false')
        .field('anonymous', 'true')
        .attach('file', './test/cutedog.jpg')
        .expect(200, done)
      ;
    });

  });

  describe('SUBMISSIONS FILES Tests', function () {

    var submission, submissionsFile;

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
      agent.post('/users/login/').send(request).expect(200, done);
    });

    it('POST upload a new user submission', function (done) {
      agent
        .post('/submissions/')
        .field('title', 'This is a title')
        .field('caption', 'This is a picture of a cute dog.')
        .field('private', 'false')
        .field('anonymous', 'false')
        .attach('file', './test/cutedog.jpg')
        .end(function (error, response) {
          if (error) throw error;
          if (response.status === 200) {
            file = response.body.name;
            submission = response.body.submission;
            done();
          }
        })
      ;
    });

    it('GET a single submissions file', function (done) {
      agent
        .get('/submissions/' + submission + '/' + file)
        .expect(200, done)
      ;
    });

    it('POST upload a new user submissions file', function (done) {
      agent
        .post('/submissions/' + submission + '/')
        .field('title', 'This is a title')
        .field('caption', 'This is a picture of a cute dog.')
        .field('private', 'false')
        .field('anonymous', 'false')
        .attach('file', './test/cutedog.jpg')
        .end(function (error, response) {
          if (error) throw error;
          if (response.status === 200) {
            file = response.body.name;
            submission = response.body.submission;
            done();
          }
        })
      ;
    });

    it('PUT update a submission', function (done) {
      agent
        .put('/submissions/' + submission + '/' + file + '/')
        .field('title', 'This is an updated title')
        .field('caption', 'This is an updated picture of a cute dog.')
        .field('private', 'false')
        .field('anonymous', 'false')
        .expect(200, done)
      ;
    });

    it('DELETE a submissions file', function (done) {
      agent
        .delete('/submissions/' + submission + '/' + file + '/')
        .expect(200, done)
      ;
    });

    it('DELETE a submission', function (done) {
      agent.delete('/submissions/' + submission + '/').expect(200, done);
    });

    it('DELETE a user account', function (done) {
      agent.delete('/users/testuser/').expect(200, done);
    });

  });

  describe('TAGS Tests', function () {

  });

});