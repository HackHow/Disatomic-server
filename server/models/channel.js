const conn = require('../../utils/mongodb');
const { User, Server } = require('../models/schema');

// 之後要加權限 role
const CreateChannel = async (serverId, channelTitle, isPublic) => {
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

module.exports = { CreateChannel };
