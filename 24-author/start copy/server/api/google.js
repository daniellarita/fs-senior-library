var router=require('express').Router();
var passport=require('passport');
var User=require('./users/user.model');

router.get('/google', passport.authenticate('google', {scope:'email'}));

//make class of Google strategy
var GoogleStrategy=require('passport-google-oauth').OAuth2Strategy;

var theGoogleStrategy = new GoogleStrategy({
  clientID:'726590877356-23tlrf4f4eaks8oc3bsml4snt5153e6k.apps.googleusercontent.com',
  clientSecret:'SMlx5MgaB6cg-caGekLsxdJf',
  callbackURL:'/google/callback'
}, function (token,refreshToken,profile,done){
  const info={
    name:profile.displayName,
    email:profile.emails[0].value,
    photo:profile.photos ? profile.photos[0].value: undefined
  };
  User.findOrCreate({
    where:{googleId:profile.id},
    defaults:info
  })
  .spread(function(user){
    done(null,user);
  })
  .catch(done);
})

//verification data

//pw auth happens after talking to the provider when they provide us with the token
//from the provider
router.get('/callback', passport.authenticate('google',{
  successRedirect:'/',
  failureRedirect:'/'
}))

module.exports=router;
