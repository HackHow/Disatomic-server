const router = require('express').Router();
const { createChannel, deleteChannel } = require('../controllers/channel');
// router.route('/channel').get();
router.route('/channel').post(createChannel);
router.route('/channel').delete(deleteChannel);

module.exports = router;
