const router = require('express').Router();
const { authentication } = require('../../utils/util');
const {
  sendInvitation,
  acceptInvitation,
  rejectInvitation,
  cancelInvitation,
  getPendingFriends,
  getAllFriends,
} = require('../controllers/friend');

router.route('/friend').post(authentication, sendInvitation);
router.route('/friend/accept').post(authentication, acceptInvitation);
router.route('/friend/reject').post(authentication, rejectInvitation);
router.route('/friend/cancel').post(authentication, cancelInvitation);

router.route('/friend/pending').get(authentication, getPendingFriends);
router.route('/friend/all').get(authentication, getAllFriends);

module.exports = router;
