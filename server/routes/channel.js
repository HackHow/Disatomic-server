const router = require('express').Router();
const {
  createChannel,
  deleteChannel,
  getChannel,
  inviteFriendToChannel,
} = require('../controllers/channel');

router.route('/channel').get(getChannel);
router.route('/channel').post(createChannel);
router.route('/channel').delete(deleteChannel);

router.route('/channel/friend').post(inviteFriendToChannel);

module.exports = router;
