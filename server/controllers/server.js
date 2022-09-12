const Server = require('../models/server');

const createServer = async (req, res) => {
  console.log('controller PASS');
  const { userId, serverName } = req.body;
  console.log('userId', userId);
  const result = await Server.createServer(userId, serverName);

  console.log('result', result);

  res.send(result);
};

module.exports = { createServer };
