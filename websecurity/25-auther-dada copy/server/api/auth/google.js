const router = require('express').Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const User = require('../users/user.model');

var secrets = require('../../../secrets');

// configuring the strategy (credentials + verification callback)
passport.use(
  new GoogleStrategy({
    clientID: '238524570915-ivf9lnhm9bsfq13cle5ap8s28d4lmhrp.apps.googleusercontent.com',
    clientSecret: secrets.google,
    callbackURL: '/api/auth/google/verify'
  },
  function (token, refreshToken, profile, done) {
    var info = {
      name: profile.displayName,
      email: profile.emails[0].value,
      photo: profile.photos ? profile.photos[0].value : undefined
    };
    User.findOrCreate({
      where: {googleId: profile.id},
      defaults: info
    })
    .spread(function (user) {
      done(null, user);
    })
    .catch(done);
  })
);

// Google authentication and login
router.get('/', passport.authenticate('google', { scope: 'email' }));

// handle the callback after Google has authenticated the user
router.get('/verify',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect(`/users/${req.user.id}`);
  }
);

module.exports = router;
