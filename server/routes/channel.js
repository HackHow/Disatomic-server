const router = require('express').Router();
const { CreateChannel } = require('../controllers/channel');
// router.route('/channel').get();
router.route('/channel').post(CreateChannel);
// router.route('/channel').delete();

module.exports = router;
