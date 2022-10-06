const router = require('express').Router();
const { signUp, signIn, getUserServer } = require('../controllers/user');
const { authentication } = require('../../utils/util');

router.route('/user/signup').post(signUp);
router.route('/user/signin').post(signIn);
router.route('/user').get(authentication, getUserServer);

module.exports = router;
