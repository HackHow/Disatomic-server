const router = require('express').Router();
const {
  getServer,
  createServer,
  deleteServer,
  // userOwnServer,
} = require('../controllers/server');
const { authentication } = require('../../utils/util');

router.route('/server').post(authentication, createServer);
router.route('/server').delete(deleteServer);
router.route('/server/:serverId').get(authentication, getServer);

module.exports = router;
