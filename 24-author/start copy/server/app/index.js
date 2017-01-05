'use strict';

var app = require('express')();
var path = require('path');
var User = require('../api/users/user.model');
//run Google.js file in api folder
var google=require('../api/google');

app.use('/google', google);

var session = require('express-session');

app.use(session({
  // this mandatory configuration ensures that session IDs are not predictable
  secret: 'danniiscool', // or whatever you like
  // these options are recommended and reduce session concurrency issues
  resave: false,
  saveUnitialized: false
}));

app.use(require('./logging.middleware'));
app.use(require('./request-state.middleware'));

//code related to passport
//app.use(require('./passport.middleware'));
var passport=require('passport');
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function (user,done){
  //found the user, passport takes over
  done(null, user.id);
});
passport.deserializeUser(function (id,done){
  //this person might be logged in
  //here is a serialized user, what do you want me to put in as req.user
  User.findById(id)
  .then(user=>done(null, user))
  .catch(done);
});

// place right after the session setup middleware
app.use(function (req, res, next) {
  console.log('session', req.session);
  next();
});

app.use('/api', function (req, res, next) {
  if (!req.session.counter) req.session.counter = 0;
  console.log('counter', ++req.session.counter);
  next();
});

// make sure this comes after the session middleware, otherwise req.session will not be available
app.post('/login', function (req, res, next) {
  User.findOne({
    where: req.body
  })
  .then(function (user) {
    if (!user) {
      res.sendStatus(401);
    } else {
      req.session.userId = user.id;
      res.json(user);
    }
  })
  .catch(next);
});

app.post('/api/auth/me', function (req, res, next) {
  User.findOrCreate({
    where: {
      email:req.body.email
    },
    defaults:{
      password:req.body.password
    }
  })
  .spread(function(user, created){
    if(!created){
      res.sendStatus(401);
    } else {
      req.session.userId=user.id;
      res.json(user);
    }
  })
  .catch(next);
})

app.delete('/api/auth/me',function(req,res,next){
  console.log("delete function to be implemented")
})

app.get('/api/auth/me', function(req,res,next){
  User.findById(req.session && req.session.userId)
    .then(user=>res.json(user))
    .catch(next);
})

/* STUFF ALREADY HERE-----------------*/
app.use(require('./statics.middleware'));

app.use('/api', require('../api/api.router'));

var validFrontendRoutes = ['/', '/stories', '/users', '/stories/:id', '/users/:id', '/signup', '/login'];
var indexPath = path.join(__dirname, '..', '..', 'browser', 'index.html');
validFrontendRoutes.forEach(function (stateRoute) {
  app.get(stateRoute, function (req, res) {
    res.sendFile(indexPath);
  });
});

app.use(require('./error.middleware'));

module.exports = app;
