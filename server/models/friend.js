const conn = require('../../utils/mongodb');
// const { User } = require('../models/schema');
const { User } = require('../models/test');

const sendInvitationToFriend = async (senderId, friendName) => {
  const session = await conn.startSession();
  try {
    session.startTransaction();
    const friend = await User.findOneAndUpdate(
      { name: friendName },
      {
        $addToSet: { incomingFriendReq: senderId },
        $set: { updatedAt: Date.now() },
      },
      { new: true }
    ).exec();

    const user = await User.findByIdAndUpdate(
      senderId,
      {
        $addToSet: { outgoingFriendReq: friend._id },
        $set: { updatedAt: Date.now() },
      },
      { new: true }
    ).exec();

    await session.commitTransaction();
    return 'Invite success';
  } catch (error) {
    await session.abortTransaction();
    console.log('error message:', error.message);
    return { error: 'Can not find this user' };
  } finally {
    session.endSession();
  }
};

const acceptInvitation = async (receiverId, senderId) => {
  const session = await conn.startSession();
  try {
    session.startTransaction();
    await User.findByIdAndUpdate(
      receiverId,
      {
        $pull: { incomingFriendReq: senderId },
        $addToSet: { friends: senderId },
      },
      { new: true }
    ).exec();

    await User.findByIdAndUpdate(
      senderId,
      {
        $pull: { outgoingFriendReq: receiverId },
        $addToSet: { friends: receiverId },
      },
      { new: true }
    ).exec();

    await session.commitTransaction();
    return 'Accept friend success';
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    return 'Accept friend fail';
  } finally {
    session.endSession();
  }
};

const rejectInvitation = async (receiverId, senderId) => {
  const session = await conn.startSession();
  try {
    session.startTransaction();
    const updateReceiverPending = await User.findByIdAndUpdate(
      receiverId,
      {
        $pull: { incomingFriendReq: senderId },
      },
      { new: true }
    ).exec();

    const updateSenderInvite = await User.findByIdAndUpdate(
      senderId,
      {
        $pull: { outgoingFriendReq: receiverId },
      },
      { new: true }
    ).exec();

    await session.commitTransaction();
    console.log('updateReceiverPending', updateReceiverPending);
    console.log('updateSenderInvite', updateSenderInvite);
    return 'Reject friend success';
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    return 'Reject friend fail';
  } finally {
    session.endSession();
  }
};

const cancelInvitation = async (senderId, receiverId) => {
  const session = await conn.startSession();
  try {
    session.startTransaction();
    await User.findByIdAndUpdate(
      senderId,
      {
        $pull: { outgoingFriendReq: receiverId },
      },
      { new: true }
    ).exec();

    await User.findByIdAndUpdate(
      receiverId,
      {
        $pull: { incomingFriendReq: senderId },
      },
      { new: true }
    ).exec();

    await session.commitTransaction();
    return 'Cancel friend success';
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    return 'Cancel friend fail';
  } finally {
    session.endSession();
  }
};

const getPendingFriends = async (userId) => {
  try {
    const user = await User.findById(userId).populate({
      path: 'outgoingFriendReq incomingFriendReq',
      select: {
        name: '$name',
      },
    });

    const outgoingRequest = user.outgoingFriendReq;
    const incomingRequest = user.incomingFriendReq;
    // console.log('outgoingRequest', outgoingRequest);
    // console.log('incomingRequest', incomingRequest);

    return { outgoingRequest, incomingRequest };
  } catch (error) {
    console.log(error);
    return { error };
  }
};

const getAllFriends = async (userId) => {
  try {
    const user = await User.findById(userId).populate({
      path: 'friends',
      select: {
        name: '$name',
      },
    });

    // console.log('user', user);
    return user.friends;
  } catch (error) {
    console.log(error);
    return { error };
  }
};

module.exports = {
  sendInvitationToFriend,
  acceptInvitation,
  rejectInvitation,
  cancelInvitation,
  getPendingFriends,
  getAllFriends,
};
