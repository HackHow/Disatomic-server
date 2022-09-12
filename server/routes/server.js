const router = require('express').Router();
const { createServer } = require('../controllers/server');

router.route('/server').post(createServer);

module.exports = router;
