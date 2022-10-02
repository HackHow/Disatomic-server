const router = require('express').Router();
const {
  getChannelOfServer,
  createServer,
  deleteServer,
} = require('../controllers/server');
const { authentication } = require('../../utils/util');

router.route('/server').post(authentication, createServer);
router.route('/server').delete(deleteServer);
router.route('/server/:serverId').get(authentication, getChannelOfServer);

module.exports = router;
