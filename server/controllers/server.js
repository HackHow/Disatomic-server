const Server = require('../models/server');

const createServer = async (req, res) => {
  const { serverName } = req.body;
  const { userId } = req.user;

  const result = await Server.createServer(userId, serverName);

  if (result.error) {
    res.status(500).send('Create Server Fail');
    return;
  }

  console.log('Create Server Success !');

  res.status(200).send(result);
  return;
};

const deleteServer = async (req, res) => {
  //const {serverId} = req.params
  const { userId, serverId } = req.body;
  const result = await Server.deleteServer(userId, serverId);

  res.status(200).send('Delete server success');
};

const getChannelOfServer = async (req, res) => {
  // const { userId } = req.user;
  const serverId = req.params['serverId'];
  const result = await Server.getChannelOfServer(serverId);

  if (result === null) {
    res.status(200).send('Have not any server');
    return;
  }

  if (result.error) {
    res.status(500).send('Database Query Error');
    return;
  }

  const channelList = result.channel.map((item) => {
    return {
      channelId: item._id,
      channelName: item.title,
      isPublic: item.isPublic,
    };
  });

  res.send({ serverName: result.serverName, channelList: channelList });
  return;
};
module.exports = { getChannelOfServer, createServer, deleteServer };
