const Channel = require('../models/channel');

const CreateChannel = async (req, res) => {
  //   const { serverId, channelTitle, isPublic } = req.body;
  const channelTitle = '公佈欄';
  const isPublic = true;
  const serverId = '63212a6a121090aff585f728';
  const result = await Channel.CreateChannel(serverId, channelTitle, isPublic);

  console.log('result', result);

  res.send(result);
};

module.exports = { CreateChannel };
