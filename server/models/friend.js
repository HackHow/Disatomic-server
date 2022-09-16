const conn = require('../../utils/mongodb');
const { User } = require('../models/schema');

const sendInvitationToFriend = async (senderId, friendName) => {
  const session = await conn.startSession();
  try {
    session.startTransaction();
    const friend = await User.findOneAndUpdate(
      { name: friendName },
      {
        $addToSet: { pendingFriends: senderId },
        $set: { updatedAt: Date.now() },
      },
      { new: true }
    ).exec();

    const user = await User.findByIdAndUpdate(
      senderId,
      {
        $addToSet: { inviteFriends: friend._id },
        $set: { updatedAt: Date.now() },
      },
      { new: true }
    ).exec();

    await session.commitTransaction();

    // return 'Outgoing Success';
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
  console.log({ receiverId, senderId });
  const session = await conn.startSession();
  try {
    session.startTransaction();
    const updateReceiverPending = await User.findByIdAndUpdate(
      receiverId,
      {
        $pull: { pendingFriends: senderId },
        $addToSet: { friends: senderId },
      },
      { new: true }
    ).exec();

    const updateSenderInvite = await User.findByIdAndUpdate(
      senderId,
      {
        $pull: { inviteFriends: receiverId },
        $addToSet: { friends: receiverId },
      },
      { new: true }
    ).exec();

    await session.commitTransaction();
    console.log('updateReceiverPending', updateReceiverPending);
    console.log('---------------------');
    console.log('updateSenderInvite', updateSenderInvite);
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
        $pull: { pendingFriends: senderId },
      },
      { new: true }
    ).exec();

    const updateSenderInvite = await User.findByIdAndUpdate(
      senderId,
      {
        $pull: { inviteFriends: receiverId },
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
  console.log({ senderId, receiverId });
  const session = await conn.startSession();
  try {
    session.startTransaction();
    const updateSenderInvite = await User.findByIdAndUpdate(
      senderId,
      {
        $pull: { inviteFriends: receiverId },
      },
      { new: true }
    ).exec();

    const updateReceiverPending = await User.findByIdAndUpdate(
      receiverId,
      {
        $pull: { pendingFriends: senderId },
      },
      { new: true }
    ).exec();

    await session.commitTransaction();
    console.log(updateReceiverPending);
    console.log(updateSenderInvite);
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
      path: 'inviteFriends pendingFriends',
      select: {
        name: '$name',
      },
    });
    const outgoingRequest = user.inviteFriends;
    const incomingRequest = user.pendingFriends;
    console.log('outgoingRequest', outgoingRequest);
    console.log('incomingRequest', incomingRequest);

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
