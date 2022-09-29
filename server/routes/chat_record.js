const router = require('express').Router();

const { getMultiChatRecord } = require('../controllers/chat_record');
const { authentication } = require('../../utils/util');

router.route('/chat/:channelId').get(authentication, getMultiChatRecord);

module.exports = router;
