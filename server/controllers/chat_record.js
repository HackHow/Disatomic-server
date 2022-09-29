const Chat = require('../models/chat_record');

const getMultiChatRecord = async (req, res) => {
  // const { userId } = req.user;
  const channelId = req.params['channelId'];
  const result = await Chat.getMultiChatRecord(channelId);

  // console.log('result:', result);
  res.status(200).send(result);
};

module.exports = { getMultiChatRecord };
