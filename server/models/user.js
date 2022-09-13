const conn = require('../../utils/mongodb');
const { User } = require('../models/schema');

const signUp = async (name, email, password) => {
  try {
    const user = await User.create({
      name,
      email,
      password,
    });
    console.log(user);
    return 'Register Success';
  } catch (error) {
    console.log('error', error.message);
    return { error: 'Email Already Exists' };
  }
};

const signIn = async (email) => {
  try {
    const user = await User.findOne({ email }).exec();
    return user;
  } catch (error) {
    console.log('error:', error.message);
    return { error: error.message };
  }
};

const profile = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    console.log('error:', error.message);
  }
};

const sendFriendInvitation = async (userId, friendName) => {
  const session = await conn.startSession();
  try {
    session.startTransaction();
    const friend = await User.findOneAndUpdate(
      { name: friendName },
      {
        $addToSet: { pendingFriends: userId },
        $set: { updatedAt: Date.now() },
      },
      { new: true }
    ).exec();

    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        $addToSet: { inviteFriends: friend._id },
        $set: { updatedAt: Date.now() },
      },
      { new: true }
    ).exec();

    await session.commitTransaction();
    console.log(friend);
    console.log(user);

    // return 'Outgoing Success';
    return { friendName: friend.name, msg: 'Outgoing Success' };
  } catch (error) {
    await session.abortTransaction();
    console.log('error message:', error.message);
    return { error: 'Can not find this user' };
  } finally {
    session.endSession();
  }
};

const acceptFriend = async (userId, senderId) => {
  const session = await conn.startSession();
  try {
    session.startTransaction();
    const updateUserFriend = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { pendingFriends: senderId },
        $push: { friends: senderId },
      },
      { new: true }
    ).exec();

    const updateSenderFriend = await User.findByIdAndUpdate(
      senderId,
      { $pull: { inviteFriends: userId }, $addToSet: { friends: userId } },
      { new: true }
    ).exec();

    await session.commitTransaction();
    console.log(updateUserFriend);
    console.log('---------------------');
    console.log(updateSenderFriend);
    return 'Accept friend success';
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    return 'Accept friend fail';
  } finally {
    session.endSession();
  }
};

const rejectFriend = async (userId, senderId) => {
  const session = await conn.startSession();
  try {
    session.startTransaction();
    const updateUserFriend = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { pendingFriends: senderId },
      },
      { new: true }
    ).exec();

    const updateSenderFriend = await User.findByIdAndUpdate(
      senderId,
      {
        $pull: { inviteFriends: userId },
      },
      { new: true }
    ).exec();

    await session.commitTransaction();
    console.log(updateUserFriend);
    console.log(updateSenderFriend);
    return 'Reject friend success';
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    return 'Reject friend fail';
  } finally {
    session.endSession();
  }
};

module.exports = {
  signUp,
  signIn,
  profile,
  sendFriendInvitation,
  acceptFriend,
  rejectFriend,
};
