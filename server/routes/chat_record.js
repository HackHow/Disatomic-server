const router = require('express').Router();

const {
  getMultiChatRecord,
  getPersonalChatRecord,
} = require('../controllers/chat_record');
const { authentication } = require('../../utils/util');

router
  .route('/chat/channel/:channelId')
  .get(authentication, getMultiChatRecord);
router
  .route('/chat/receiver/:receiverId')
  .get(authentication, getPersonalChatRecord);

module.exports = router;
