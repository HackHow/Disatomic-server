const Channel = require('../models/channel');

const createChannel = async (req, res) => {
  const { userId } = req.user;
  const { serverId, channelTitle, isPublic } = req.body;
  const result = await Channel.createChannel(
    serverId,
    channelTitle,
    isPublic,
    userId
  );

  if (result.error) {
    res.status(500).send(result.error);
    return;
  }

  console.log('result', result);

  res.send(result);
};

const deleteChannel = async (req, res) => {
  const { serverId, channelId } = req.body;
  const result = await Channel.deleteChannel(serverId, channelId);

  console.log('result', result);
  res.send(result);
};

const getChannel = async (req, res) => {
  const { channelId } = req.body;
  const result = await Channel.getChannel(channelId);

  console.log(result);
  res.send(result);
};

const inviteFriendToChannel = async (req, res) => {
  const { serverId, channelId, friendId } = req.body;
  const result = await Channel.inviteFriendToChannel(
    serverId,
    channelId,
    friendId
  );

  console.log(result);
  res.send(result);
};

module.exports = {
  createChannel,
  deleteChannel,
  getChannel,
  inviteFriendToChannel,
};
