const Channel = require('../models/channel');

const createChannel = async (req, res) => {
  const { serverId, channelTitle, isPublic } = req.body;
  const result = await Channel.createChannel(serverId, channelTitle, isPublic);

  console.log('result', result);

  res.send(result);
};

const deleteChannel = async (req, res) => {
  const { serverId, channelId } = req.body;
  const result = await Channel.deleteChannel(serverId, channelId);

  console.log('result', result);
  res.send(result);
};

module.exports = { createChannel, deleteChannel };
