require('dotenv').config();
const Channel = require('../models/channel');

const getAllChannel = async (userId) => {
  const result = await Channel.getAllChannel(userId);

  if (result.error) {
    throw new Error(result.error);
  }

  const userChannels = [];
  if (result.length > 0) {
    for (let i = 0; i < result.length; i++) {
      const channel = result[i].serverId.channel;
      if (channel.length > 0) {
        for (let j = 0; j < channel.length; j++) {
          userChannels.push(channel[j].id);
        }
      }
    }
  }

  return userChannels;
};

module.exports = { getAllChannel };
