const router = require('express').Router();
const { authentication } = require('../../utils/util');
const {
  sendInvitationToFriend,
  acceptFriend,
  rejectFriend,
  cancelFriend,
} = require('../controllers/friend');

router.route('/friend').post(authentication, sendInvitationToFriend);
// router.route('/user/friend/pending').get();
router.route('/friend/accept').post(acceptFriend);
router.route('/friend/reject').post(rejectFriend);
router.route('/friend/cancel').post(cancelFriend);
// router.route('/user/friend/:state').get();

module.exports = router;
