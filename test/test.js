var exec = require('child_process').exec
  , supertest = require('supertest')
;

describe('SlippyNode Image Server REST API Tests', function () {

  var server, agent;

  before(function (done) {
    var cmd = 'createdb -O photojoe_user photojoe_db -E utf8';
    cmd += ' && psql -d photojoe_db -f photo-joe.sql';
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
    var cmd = 'dropdb photojoe_db';
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
      agent.post('/admin/register/').send(request).expect(201, done);
    });

    it('POST login to an existing user account', function (done) {
      var request = {
        "username": "testuser",
        "email": "testuser@test.com",
        "password": "secret"
      };
      agent.post('/admin/login/').send(request).expect(200, done);
    });

    it('GET a single user', function (done) {
      agent.get('/users/testuser/').expect(200, done);
    });

    it('POST logout of an existing user account', function (done) {
      var request = {
        "username": "testuser",
        "email": "testuser@test.com",
        "password": "secret"
      };
      agent.post('/admin/logout/').send(request).expect(200, done);
    });

    it('POST login to an existing user account', function (done) {
      var request = {
        "username": "testuser",
        "email": "testuser@test.com",
        "password": "secret"
      };
      agent.post('/admin/login/').send(request).expect(200, done);
    });

    it('PUT changes to a user account', function (done) {
      var request = {
        "username": "testuser2",
        "email": "testuser2@test.com",
        "password": "opensesame"
      };
      agent.put('/users/testuser/').send(request).expect(200, done);
    });

  });

  describe('GALLERIES Tests', function () {

    var gallery;

    it('POST upload a new user gallery', function (done) {
      agent
        .post('/galleries/')
        .field('title', 'This is a title')
        .field('description', 'This is a picture of a cute dog.')
        .attach('file', './test/cutedog.jpg')
        .expect(200, done)
      ;
    });

    it('GET all galleries', function (done) {
      agent
        .get('/galleries/')
        .end(function (error, response) {
          if (error) throw error;
          if (response.status === 200) {
            gallery = response.body[0].name;
            done();
          }
        })
      ;
    });

    it('GET a single gallery', function (done) {
      agent.get('/galleries/' + gallery + '/').expect(200, done);
    });

    it('PUT update a gallery', function (done) {
      agent
        .put('/galleries/' + gallery + '/')
        .field('title', 'This is an updated title')
        .field('description', 'This is an updated picture of a cute dog.')
        .expect(200, done)
      ;
    });

    it('DELETE a gallery', function (done) {
      agent.delete('/galleries/' + gallery + '/').expect(200, done);
    });

  });

  describe('GALLERIES IMAGES Tests', function () {

    var gallery, image;
/*
    it('POST login to an existing user account', function (done) {
      var request = {
        "username": "testuser",
        "email": "testuser@test.com",
        "password": "secret"
      };
      agent.post('/admin/login/').send(request).expect(200, done);
    });

    it('POST upload a new user submission', function (done) {
      agent
        .post('/galleries/')
        .field('title', 'This is a title')
        .field('caption', 'This is a picture of a cute dog.')
        .field('private', 'false')
        .field('anonymous', 'false')
        .attach('file', './test/cutedog.jpg')
        .end(function (error, response) {
          if (error) throw error;
          if (response.status === 200) {
            image = response.body.name;
            gallery = response.body.gallery;
            done();
          }
        })
      ;
    });

    it('GET a single galleries image', function (done) {
      agent
        .get('/galleries/' + gallery + '/' + image)
        .expect(200, done)
      ;
    });

    it('POST upload a new galleries image', function (done) {
      agent
        .post('/galleries/' + gallery + '/images/')
        .field('title', 'This is a title')
        .field('caption', 'This is a picture of a cute dog.')
        .field('private', 'false')
        .field('anonymous', 'false')
        .attach('file', './test/cutedog.jpg')
        .end(function (error, response) {
          if (error) throw error;
          if (response.status === 200) {
            image = response.body.name;
            gallery = response.body.gallery;
            done();
          }
        })
      ;
    });

    it('PUT update a gallery', function (done) {
      agent
        .put('/galleries/' + submission + '/images/' + image + '/')
        .field('title', 'This is an updated title')
        .field('caption', 'This is an updated picture of a cute dog.')
        .field('private', 'false')
        .field('anonymous', 'false')
        .expect(200, done)
      ;
    });

    it('DELETE a submissions file', function (done) {
      agent
        .delete('/galleries/' + gallery + '/images/' + image + '/')
        .expect(200, done)
      ;
    });

    it('DELETE a submission', function (done) {
      agent.delete('/galleries/' + gallery + '/').expect(200, done);
    });
*/
  });

});