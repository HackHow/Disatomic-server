const router = require('express').Router();
const {
  createServer,
  deleteServer,
  userOwnServer,
} = require('../controllers/server');
const { authentication } = require('../../utils/util');

router.route('/server').post(authentication, createServer);
router.route('/server').delete(deleteServer);
// router.route('/server').get(userOwnServer);

// router.route('/server/:serverId').get();

module.exports = router;
