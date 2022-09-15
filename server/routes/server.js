const router = require('express').Router();
const {
  createServer,
  deleteServer,
  userOwnServer,
} = require('../controllers/server');
const { authorization } = require('../../utils/util');

router.route('/server').post(authorization, createServer);
router.route('/server').delete(deleteServer);
// router.route('/server').get(userOwnServer);

// router.route('/server/:serverId').get();

module.exports = router;
