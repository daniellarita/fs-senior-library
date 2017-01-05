'use strict';

var app = require('express')();
var path = require('path');
var session = require('express-session');

// "Enhancing" middleware (does not send response, server-side effects only)

app.use(require('./logging.middleware'));

app.use(require('./body-parsing.middleware'));

var secrets = require('../../secrets');

app.use(session({
  secret: secrets.session,
  resave: false,
  saveUninitialized: false
}));

app.use(require('./passport.middleware'));

// // solution to the "session counter" exercise
// app.use('/api', function (req, res, next) {
//   if (!req.session.counter) req.session.counter = 0;
//   console.log('counter', ++req.session.counter);
//   req.session.save(next); // reduces chance of counter "repeating" due to concurrent requests
// });

// app.use(function (req, res, next) {
//   console.log('session', req.session);
//   next();
// });

// "Responding" middleware (may send a response back to client)

app.use('/api', require('../api/api.router'));

var validFrontendRoutes = ['/', '/stories', '/users', '/stories/:id', '/users/:id', '/signup', '/login'];
var indexPath = path.join(__dirname, '..', '..', 'browser', 'index.html');
validFrontendRoutes.forEach(function (stateRoute) {
  app.get(stateRoute, function (req, res) {
    res.sendFile(indexPath);
  });
});

app.use(require('./statics.middleware'));

app.use(require('./error.middleware'));

module.exports = app;
