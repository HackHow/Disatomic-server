const router = require('express').Router();
const {
  getServerInfo,
  createServer,
  deleteServer,
} = require('../controllers/server');
const { authentication } = require('../../utils/util');

router.route('/server').post(authentication, createServer);
router.route('/server').delete(deleteServer);
router.route('/server/:serverId').get(authentication, getServerInfo);

module.exports = router;
