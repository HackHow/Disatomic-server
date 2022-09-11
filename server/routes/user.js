const router = require('express').Router();
const { signUp, signIn, profile } = require('../controllers/user');

router.route('/user/signup').post(signUp);
router.route('/user/signin').post(signIn);
router.route('/user/profile').get(profile);

module.exports = router;
