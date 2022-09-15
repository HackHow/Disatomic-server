const conn = require('../../utils/mongodb');
const { User, Server } = require('../models/schema');

// 之後要加權限 role
const createChannel = async (serverId, channelTitle, isPublic, userId) => {
  try {
    const channel = await Server.findByIdAndUpdate(
      serverId,
      {
        category: {
          channel: {
            title: 'AAAA',
            isPublic: isPublic,
            members: { userName: userId, permission: 'owner' },
          },
        },
      },
      { new: true }
    );
    // console.log(channel.category.length);
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

const getChannel = async (channelId) => {
  try {
    const channel = await Server.findOne({
      'category.channel._id': channelId,
    });

    console.log(channel.category[0].channel);
    return 'ok';
  } catch (error) {
    console.log(error);
  }
};

const inviteFriendToChannel = async (serverId, channelId, friendId) => {
  console.log(friendId);
  try {
    const channel = await Server.findOneAndUpdate(
      { 'category.channel._id': '6321db2b42dcf64401411111' },
      {
        $addToSet: { $each: { members: friendId } },
        $addToSet: {
          'category.0.channel.$.members': {
            userName: friendId,
            permission: 'admin',
          },
        },
      },
      { new: true }
    );

    console.log(channel);
    // console.log(channel.category[0].channel[0]);
    return 'OK';
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createChannel,
  deleteChannel,
  getChannel,
  inviteFriendToChannel,
};
