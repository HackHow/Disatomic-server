const router = require('express').Router();
const {
  signUp,
  signIn,
  profile,
  sendFriendInvitation,
  acceptFriend,
} = require('../controllers/user');

router.route('/user/signup').post(signUp);
router.route('/user/signin').post(signIn);
router.route('/user/profile').get(profile);

router.route('/user/friend').post(sendFriendInvitation);
router.route('/user/friend/pending').post(acceptFriend);
router.route('/user/friend/:state').get();

module.exports = router;
