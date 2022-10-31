const router = require('express').Router();
const {
  createChannel,
  deleteChannel,
  inviteFriendToChannel,
} = require('../controllers/channel');
const { authentication } = require('../../utils/util');

router.route('/channel').post(authentication, createChannel);
router.route('/channel').delete(deleteChannel);
router.route('/channel/friend').post(authentication, inviteFriendToChannel);

module.exports = router;
