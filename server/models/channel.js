const conn = require('../../utils/mongodb');
// const { User, Server } = require('../models/schema');
const { User, Server } = require('../models/test');

// 之後要加權限 role
const createChannel = async (serverId, channelTitle, isPublic, userId) => {
  try {
    const channel = await Server.findByIdAndUpdate(
      serverId,
      {
        $push: {
          'category.0.channel': {
            title: channelTitle,
            isPublic: isPublic,
            members: { userName: userId, permission: 'owner' },
          },
        },
      },
      // {
      //   $push: {
      //     category: {
      //       channel: {
      //         title: channelTitle,
      //         isPublic: isPublic,
      //         members: { userName: userId, permission: 'owner' },
      //       },
      //     },
      //   },
      // },
      {
        fields: {
          'category.channel.title': 1,
          'category.channel.isPublic': 1,
          'category.channel.members': 1,
          'category.channel._id': 1,
        },
        new: true,
      }
    );
    // console.log(channel.category.length);
    console.log(channel);
    console.log(channel.category);
    // console.log(channel.category[0].channel[0].members);
    // console.log(channel.category[0].channel[3].members);

    return channel.category[0].channel;
  } catch (error) {
    console.log(error);
    return { error: 'Create channel fail' };
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

    // console.log(channel.category[0].channel);
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
