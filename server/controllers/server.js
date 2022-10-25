require('dotenv').config();
const Server = require('../models/server');

const createServer = async (req, res) => {
  const { serverName } = req.body;
  const { userId } = req.user;

  const result = await Server.createServer(userId, serverName);

  if (result.error) {
    res.status(500).send('Create Server Fail');
    return;
  }

  res.status(200).send(result);
  return;
};

const deleteServer = async (req, res) => {
  const { userId, serverId } = req.body;
  const result = await Server.deleteServer(userId, serverId);

  res.status(200).send('Delete server success');
  return;
};

const getChannelOfServer = async (req, res) => {
  const serverId = req.params['serverId'];
  const result = await Server.getChannelOfServer(serverId);

  if (result.error) {
    res.status(500).send('Database Query Error');
    return;
  }

  let channelList = [];
  if (result.length > 0) {
    channelList = result.map((item) => {
      return {
        channelId: item._id,
        channelName: item.name,
        isPublic: item.isPublic,
      };
    });
  }

  res.status(200).send({ channelList });
  return;
};

module.exports = {
  getChannelOfServer,
  createServer,
  deleteServer,
};
