const router = require('express').Router();
const meRouter = require('./me');
const googleRouter = require('./google');
const githubRouter = require('./github');
const twitterRouter = require('./twitter');

router.use('/me', meRouter);

router.use('/google', googleRouter);
router.use('/github', githubRouter);
router.use('/twitter', twitterRouter);

module.exports = router;
