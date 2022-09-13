const { User } = require('../models/schema');
const Server = require('../models/server');

const createServer = async (req, res) => {
  console.log('controller createServer PASS');
  const { userId, serverName } = req.body;
  const result = await Server.createServer(userId, serverName);

  console.log('result', result);

  res.send(result);
};

const deleteServer = async (req, res) => {
  console.log('controller deleteServer PASS');
  //const {serverId} = req.params
  const { userId, serverId } = req.body;
  const result = await Server.deleteServer(userId, serverId);

  res.status(200).send('Delete server success');
};

const ownServer = async (req, res) => {
  const { userId } = req.body;
  const result = await Server.ownServer(userId);
  console.log(result.map((item) => item.server));
  res.send('OK');
};

module.exports = { createServer, deleteServer, ownServer };
