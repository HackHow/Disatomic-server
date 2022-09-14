const router = require('express').Router();
const {
  createChannel,
  deleteChannel,
  getChannel,
} = require('../controllers/channel');

router.route('/channel').get(getChannel);
router.route('/channel').post(createChannel);
router.route('/channel').delete(deleteChannel);

module.exports = router;
