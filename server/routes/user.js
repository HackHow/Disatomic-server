const router = require('express').Router();
const { signUp, signIn, profile, friend } = require('../controllers/user');

router.route('/user/signup').post(signUp);
router.route('/user/signin').post(signIn);
// router.route('/user/profile').get(profile);
router.route('/user/friend').post(friend);
router.route('/user/friend/:state').get();

module.exports = router;
