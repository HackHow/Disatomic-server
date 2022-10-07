require('dotenv').config();
const Chat = require('../models/chat_record');

const getMultiChatRecord = async (req, res) => {
  // const { userId } = req.user;
  const channelId = req.params['channelId'];
  const result = await Chat.getMultiChatRecord(channelId);
  const chatRecord = result[0].channel[0].chatRecord;

  res.status(200).send(chatRecord);
  return;
};

const getPersonalChatRecord = async (req, res) => {
  const { userId } = req.user;
  const receiverId = req.params['receiverId'];
  const result = await Chat.getPersonalChatRecord(userId, receiverId);

  res.status(200).send(result);
  return;
};

module.exports = { getMultiChatRecord, getPersonalChatRecord };
