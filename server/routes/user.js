const router = require('express').Router();
const {
  signUp,
  signIn,
  userInfo,
  sendFriendInvitation,
  acceptFriend,
  rejectFriend,
  cancelFriend,
} = require('../controllers/user');
const { authorization } = require('../../utils/util');

router.route('/user/signup').post(signUp);
router.route('/user/signin').post(signIn);
router.route('/user').get(authorization, userInfo);

router.route('/user/friend').post(sendFriendInvitation);
// router.route('/user/friend/pending').get();
router.route('/user/friend/accept').post(acceptFriend);
router.route('/user/friend/reject').post(rejectFriend);
router.route('/user/friend/cancel').post(cancelFriend);
// router.route('/user/friend/:state').get();

module.exports = router;
