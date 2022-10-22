require('dotenv').config();
const Channel = require('../models/channel');

const createChannel = async (req, res) => {
  const { userId } = req.user;
  const { serverId, channelName, isPublic } = req.body;
  const result = await Channel.createChannel(
    serverId,
    channelName,
    isPublic,
    userId
  );

  if (result.error) {
    res.status(500).send(result.error);
    return;
  }

  res.status(200).send({
    serverMembers: result.members,
    channelId: result.channel[0]._id,
    channelName: result.channel[0].name,
    isPublic: result.channel[0].isPublic,
    msg: 'Created a channel successfully',
  });
  return;
};

const deleteChannel = async (req, res) => {
  const { serverId, channelId } = req.body;
  const result = await Channel.deleteChannel(serverId, channelId);

  res.send(result);
  return;
};

const inviteFriendToChannel = async (req, res) => {
  // const { userId } = req.user;
  const { serverId, channelId, friendName } = req.body;
  const result = await Channel.inviteFriendToChannel(
    serverId,
    channelId,
    friendName
  );

  if (result.error) {
    res.status(404).send({ msg: 'Please provide a valid username' });
    return;
  }

  res.status(200).send(result);
  return;
};

module.exports = {
  createChannel,
  deleteChannel,
  inviteFriendToChannel,
};
