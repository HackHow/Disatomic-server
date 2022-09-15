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
  //const {serverId} = req.params
  const { userId, serverId } = req.body;
  const result = await Server.deleteServer(userId, serverId);

  res.status(200).send('Delete server success');
};

const userOwnServer = async (req, res) => {
  const { userId } = req.body;
  const result = await Server.ownServer(userId);
  console.log(result.map((item) => item.server));
  res.send('OK');
};

module.exports = { createServer, deleteServer, userOwnServer };
