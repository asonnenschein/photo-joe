var express = require('express')
  , handlebars = require('express-handlebars')
  , cookieParser = require('cookie-parser')
  , session = require('express-session')
  , bodyParser = require('body-parser')
  , passport = require('passport')
  , multer = require('multer')
  , config = require('./config.json')
  , database = require('./database')
  , routes = require('./routes')(database)
  , server = express();
;

server.set('port', process.env.PORT || 3030);

server.use(cookieParser('secret'));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json({ limit: '25mb' }));

require('./passport')(passport);

server.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

server.use(passport.initialize());
server.use(passport.session());

server.enable('trust proxy');

server.engine('handlebars', handlebars({ defaultLayout: 'index' }));
server.set('view engine', 'handlebars');

function checkAuthorization (req, res, next) {
  if (req.isAuthenticated && req.user.id) return next();
  else res.status(401).send("Unauthorized request!");
}

// Public Routes ===============================================================
server.use(express.static(__dirname + '/public/'));
server.use("/images", express.static(__dirname + '/uploads/'));

server.get('/',
  function (req, res) {
    res.render('home');
  })
;

server.get('/galleries',
  function (req, res) {
    res.render('galleries');
  })
;

server.get('/about',
  function (req, res) {
    res.render('about');
  })
;

server.get('/login',
  function (req, res) {
    res.render('login');
  })
;

server.get('/users/:username/',
  checkAuthorization,
  function (req, res, next) {
    return next();
  }, routes.getUser)
;

/*
server.get('/users/:username/',
  checkAuthorization,
  function (req, res, next) {
    return next();
  }, routes.getUser)
;
*/
// Login & Logout Routes =======================================================
server.post('/users/login/',
  passport.authenticate('login'),
  function (req, res, next) {
    var username = req.user.get('username');
    res.redirect('/users/' + username + '/');
  })
;

server.post('/users/logout/',
  checkAuthorization,
  function (req, res, next) {
    req.logout();
    res.status(200).end();
  })
;

// User Routes =================================================================
server.get('/users/:username/submissions/',
  checkAuthorization,
  function (req, res, next) {
    return next();
  }, routes.getUserSubmissions)
;

server.post('/users/',
  passport.authenticate('register'),
  function (req, res, next) {
    res.status(201).send(req.user);
  })
;

server.put('/users/:username/',
  checkAuthorization,
  function (req, res, next) {
    return next();
  }, routes.updateUser)
;

server.delete('/users/:username/',
  checkAuthorization,
  function (req, res, next) {
    return next();
  }, routes.deleteUser)
;

// Submissions Routes ==========================================================
server.get('/submissions/',
  function (req, res, next) {
    return next();
  }, routes.getSubmissions)
;

server.get('/submissions/:submission/',
  function (req, res, next) {
    return next();
  }, routes.getSubmission)
;

server.post('/submissions/',
  multer({
    dest: config.uploads,
    onFileUploadStart: function (file, req, res) {
      if (config.allowed_extensions.indexOf(file.extension) < 0) {
        return false;
      }
    }
  }),
  function (req, res, next) {
    return next();
  }, routes.createSubmission)
;

server.put('/submissions/:submission/',
  checkAuthorization,
  function (req, res, next) {
    return next();
  }, routes.updateSubmission)
;

server.delete('/submissions/:submission/',
  checkAuthorization,
  function (req, res, next) {
    return next();
  }, routes.deleteSubmission)
;

// Submissions Files Routes ====================================================
server.get('/submissions/:submission/all/',
  function (req, res, next) {
    return next();
  }, routes.getSubmissionsFiles)
;

server.get('/submissions/:submission/:file/',
  function (req, res, next) {
    return next();
  }, routes.getSubmissionsFile)
;

server.post('/submissions/:submission/',
  checkAuthorization,
  multer({
    dest: config.uploads,
    onFileUploadStart: function (file, req, res) {
      if (config.allowed_extensions.indexOf(file.extension) < 0) {
        return false;
      }
    }
  }),
  function (req, res, next) {
    return next();
  }, routes.createSubmissionsFile)
;

server.put('/submissions/:submission/:file/',
  checkAuthorization,
  function (req, res, next) {
    return next();
  }, routes.updateSubmissionsFile)
;

server.delete('/submissions/:submission/:file/',
  checkAuthorization,
  function (req, res, next) {
    return next();
  }, routes.deleteSubmissionsFile)
;

module.exports = function (callback) { callback(server); };