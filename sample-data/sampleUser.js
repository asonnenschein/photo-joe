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

  describe('USER Tests', function () {

    it('POST register a new user account', function (done) {
      var request = {
        "username": "testuser",
        "email": "testuser@test.com",
        "password": "secret"
      };
      agent.post('/users/').send(request).expect(201, done);
    });

  });

});