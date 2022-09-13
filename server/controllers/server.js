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
  const { userId, serverId } = req.body;
  const result = await Server.deleteServer(userId, serverId);

  console.log('deleteServer result:', result);

  res.send(result);
};

module.exports = { createServer, deleteServer };
