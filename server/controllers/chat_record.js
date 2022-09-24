const Chat = require('../models/chat_record');

const getMultiChatRecord = async (req, res) => {
  const { userId } = req.user;
  const { serverId, channelId } = req.body;
  const result = await Chat.getMultiChatRecord(serverId, channelId);

  console.log('result:', result);
  res.status(200).send('OK');
};

module.exports = { getMultiChatRecord };
