const conn = require('../../utils/mongodb');
const { User, Server } = require('../models/schema');

// 之後要加權限 role
const createChannel = async (serverId, channelTitle, isPublic) => {
  try {
    const channel = await Server.findByIdAndUpdate(
      serverId,
      {
        category: {
          channel: {
            title: channelTitle,
            isPublic: isPublic,
          },
        },
      },
      { new: true }
    );

    console.log(channel.category[0].channel);

    return 'Create channel success';
  } catch (error) {
    console.log(error);
    return 'Create channel fail';
  }
};

const deleteChannel = async (serverId, channelId) => {
  try {
    const channel = await Server.findByIdAndUpdate(
      serverId,
      { category: { $pull: { channel: { _id: channelId } } } },
      { new: true }
    );

    console.log(channel);
    return 'Delete channel success';
  } catch (error) {
    console.log(error);
    return 'Delete channel fail';
  }
};

module.exports = { createChannel, deleteChannel };
