const router = require('express').Router();
const {
  createChannel,
  deleteChannel,
  getChannel,
  inviteFriendToChannel,
} = require('../controllers/channel');
const { authentication } = require('../../utils/util');

router.route('/channel/:channelId').get(authentication, getChannel);
router.route('/channel').post(authentication, createChannel);
router.route('/channel').delete(deleteChannel);

router.route('/channel/friend').post(authentication, inviteFriendToChannel);

module.exports = router;
