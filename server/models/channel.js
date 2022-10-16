const conn = require('../../utils/mongodb');
const { User, Server } = require('./schema');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const createChannel = async (serverId, channelName, isPublic, userId) => {
  try {
    await Server.findByIdAndUpdate(
      serverId,
      {
        $push: {
          channel: {
            name: channelName,
            isPublic: isPublic,
            members: { userId: userId, permission: 'owner' },
          },
        },
      },
      { new: true }
    );

    const { channel } = await Server.findOne(
      { 'channel.name': channelName },
      { 'channel.$': 1 }
    );

    return channel;
  } catch (error) {
    console.log(error);
    return { error: 'Create Channel Fail' };
  }
};

const deleteChannel = async (serverId, channelId) => {
  try {
    const channel = await Server.findByIdAndUpdate(
      serverId,
      { category: { $pull: { channel: { _id: channelId } } } },
      { new: true }
    );

    // console.log(channel);
    return 'Delete channel success';
  } catch (error) {
    console.log(error);
    return 'Delete channel fail';
  }
};

const inviteFriendToChannel = async (serverId, channelId, friendName) => {
  const session = await conn.startSession();
  try {
    session.startTransaction();
    const user = await User.findOne({ name: friendName }, 'name');

    const { _id, serverName } = await Server.findOneAndUpdate(
      { _id: serverId },
      {
        $addToSet: { members: user._id },
        $addToSet: { 'roles.3.usersId': user._id },
      },
      { new: true }
    );

    const userServers = {
      serverId: _id,
      serverName: serverName,
    };

    // const test = await Server.findOneAndUpdate(
    //   { serverId },
    //   {
    //     $addToSet: { members: user._id },
    //     $addToSet: { 'roles.3.usersId': user._id },
    //   },
    //   { new: true }
    // );

    // console.log('test', test);

    const { channel } = await Server.findOneAndUpdate(
      { 'channel._id': channelId },
      {
        $addToSet: {
          'channel.$.members': {
            userId: user._id,
            permission: 'reader',
          },
        },
      },
      { new: true }
    ).exec();

    const channelList = channel.map((item) => {
      return {
        channelId: item._id,
        channelName: item.name,
        isPublic: item.isPublic,
      };
    });

    const selectChannel = await Server.aggregate([
      { $match: { 'channel._id': ObjectId(channelId) } },
    ]);

    // console.log('selectChannel', selectChannel);
    let channelMembersInfo;

    channelMembersInfo = selectChannel[0].channel.filter(
      (item) => item._id.toString() === channelId
    );

    channelMembersInfo = channelMembersInfo[0].members.pop();
    // console.log(channelMembersInfo);

    await User.findByIdAndUpdate(
      user._id,
      {
        $addToSet: {
          servers: {
            userPermission: channelMembersInfo.userId,
            serverId: serverId,
          },
        },
      },
      { new: true }
    );

    await session.commitTransaction();
    return {
      msg: 'Invite friend to channel success',
      receiverId: user._id,
      userServers: userServers,
      channelList: channelList,
    };
    // return 'Invite friend to channel success';
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    return { error };
  } finally {
    session.endSession();
  }
};

const getAllChannel = async (userId) => {
  try {
    const { servers } = await User.findById(userId, { 'servers': 1 }).populate({
      path: 'servers.serverId',
      select: { 'channel': 1 },
    });

    return servers;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createChannel,
  deleteChannel,
  inviteFriendToChannel,
  getAllChannel,
};
