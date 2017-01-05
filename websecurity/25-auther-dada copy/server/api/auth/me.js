const router = require('express').Router();
const User = require('../users/user.model');
// const HttpError = require('../../utils/HttpError');

// This marries the original auth code we wrote to Passport.
// An alternative would be to use the "local strategy" option with Passport.

// check currently-authenticated user, i.e. "who am I?"
router.get('/', function (req, res, next) {
  // with Passport:
  res.send(req.user);
  // // before, without Passport:
  // User.findById(req.session.userId)
  // .then(user => res.json(user))
  // .catch(next);
});

// signup, i.e. "let `me` introduce myself"
router.post('/', function (req, res, next) {
  User.findOrCreate({
    where: {
      email: req.body.email
    },
    defaults: { // if the user doesn't exist, create including this info
      password: req.body.password
    }
  })
  .spread((user, created) => {
    if (created) {
      // with Passport:
      req.logIn(user, function (err) {
        if (err) return next(err);
        res.json(user);
      });
      // // before, without Passport:
      // req.session.userId = user.id;
      // res.json(user);
    } else {
      res.sendStatus(401); // this user already exists, you cannot sign up
    }
  });
});

// login, i.e. "you remember `me`, right?"
router.put('/', function (req, res, next) {
  User.findOne({
    where: {
      email: req.body.email + ''
    },
    attributes: {
      include: ['password', 'salt']
    }
  })
  .then(user => {
    if (!user) {
      res.sendStatus(401); // no message; good practice to omit why auth fails
    } else {
      if (user.isPasswordValid(req.body.password)) {
        // with Passport:
        req.logIn(user, function (err) {
          if (err) return next(err);
          res.json(user);
        });
      } else {
        res.sendStatus(401);
      }
      // // before, without Passport:
      // req.session.userId = user.id;
      // res.json(user);
    }
  })
  .catch(next);
});

// logout, i.e. "please just forget `me`"
router.delete('/', function (req, res, next) {
  // with Passport
  req.logOut();
  // // before, without Passport
  // delete req.session.userId;
  res.sendStatus(204);
});

module.exports = router;
