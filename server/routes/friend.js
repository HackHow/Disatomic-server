const router = require('express').Router();
const { authentication } = require('../../utils/util');
const {
  sendInvitationToFriend,
  acceptInvitation,
  rejectInvitation,
  cancelInvitation,
  getPendingFriends,
  getAllFriends,
} = require('../controllers/friend');

router.route('/friend').post(authentication, sendInvitationToFriend);
router.route('/friend/pending').get(authentication, getPendingFriends);
router.route('/friend/all').get(authentication, getAllFriends);

router.route('/friend/accept').post(acceptInvitation);
router.route('/friend/reject').post(authentication, rejectInvitation);
router.route('/friend/cancel').post(authentication, cancelInvitation);

module.exports = router;
