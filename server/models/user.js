const conn = require('../../utils/mongodb');
const { User } = require('../models/schema');

const signUp = async (name, email, password) => {
  try {
    const user = await User.create({
      name,
      email,
      password,
    });
    console.log('Register Success');
    return user;
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

const userInfo = async (userId) => {
  try {
    const { servers } = await User.findById(userId)
      .populate({
        path: 'servers.serverId',
        select: { _id: 0, serverName: '$serverName' },
      })
      .exec();

    const { friends } = await User.findById(userId).populate({
      path: 'friends',
      select: { _id: 0, name: '$name' },
    });

    return { servers, friends };
  } catch (error) {
    return error;
  }
};

// const sendFriendInvitation = async (senderId, friendName) => {
//   console.log('senderId:', senderId);
//   console.log('friendName:', friendName);
//   const session = await conn.startSession();
//   try {
//     session.startTransaction();
//     const friend = await User.findOneAndUpdate(
//       { name: friendName },
//       {
//         $addToSet: { pendingFriends: senderId },
//         $set: { updatedAt: Date.now() },
//       },
//       { new: true }
//     ).exec();

//     const user = await User.findOneAndUpdate(
//       { _id: senderId },
//       {
//         $addToSet: { inviteFriends: friend._id },
//         $set: { updatedAt: Date.now() },
//       },
//       { new: true }
//     ).exec();

//     await session.commitTransaction();
//     console.log('friend', friend);
//     console.log('user', user);

//     // return 'Outgoing Success';
//     return { friendName: friend.name, msg: 'Outgoing Success' };
//   } catch (error) {
//     await session.abortTransaction();
//     console.log('error message:', error.message);
//     return { error: 'Can not find this user' };
//   } finally {
//     session.endSession();
//   }
// };

// const acceptFriend = async (receiverId, senderId) => {
//   console.log({ receiverId, senderId });
//   const session = await conn.startSession();
//   try {
//     session.startTransaction();
//     const updateReceiverFriend = await User.findByIdAndUpdate(
//       receiverId,
//       {
//         $pull: { pendingFriends: senderId },
//         $push: { friends: senderId },
//       },
//       { new: true }
//     ).exec();

//     const updateSenderFriend = await User.findByIdAndUpdate(
//       senderId,
//       {
//         $pull: { inviteFriends: receiverId },
//         $addToSet: { friends: receiverId },
//       },
//       { new: true }
//     ).exec();

//     await session.commitTransaction();
//     console.log('updateReceiverFriend', updateReceiverFriend);
//     console.log('---------------------');
//     console.log('updateSenderFriend', updateSenderFriend);
//     return 'Accept friend success';
//   } catch (error) {
//     await session.abortTransaction();
//     console.log(error);
//     return 'Accept friend fail';
//   } finally {
//     session.endSession();
//   }
// };

// const rejectFriend = async (receiverId, senderId) => {
//   const session = await conn.startSession();
//   try {
//     session.startTransaction();
//     const updateReceiverFriend = await User.findByIdAndUpdate(
//       receiverId,
//       {
//         $pull: { pendingFriends: senderId },
//       },
//       { new: true }
//     ).exec();

//     const updateSenderFriend = await User.findByIdAndUpdate(
//       senderId,
//       {
//         $pull: { inviteFriends: receiverId },
//       },
//       { new: true }
//     ).exec();

//     await session.commitTransaction();
//     console.log('updateReceiverFriend', updateReceiverFriend);
//     console.log('updateSenderFriend', updateSenderFriend);
//     return 'Reject friend success';
//   } catch (error) {
//     await session.abortTransaction();
//     console.log(error);
//     return 'Reject friend fail';
//   } finally {
//     session.endSession();
//   }
// };

// const cancelFriend = async (senderId, receiverId) => {
//   console.log({ senderId, receiverId });
//   const session = await conn.startSession();
//   try {
//     session.startTransaction();
//     const updateSenderFriend = await User.findByIdAndUpdate(
//       senderId,
//       {
//         $pull: { inviteFriends: receiverId },
//       },
//       { new: true }
//     ).exec();

//     const updateReceiverFriend = await User.findByIdAndUpdate(
//       receiverId,
//       {
//         $pull: { pendingFriends: senderId },
//       },
//       { new: true }
//     ).exec();

//     await session.commitTransaction();
//     console.log(updateReceiverFriend);
//     console.log(updateSenderFriend);
//     return 'Cancel friend success';
//   } catch (error) {
//     await session.abortTransaction();
//     console.log(error);
//     return 'Cancel friend fail';
//   } finally {
//     session.endSession();
//   }
// };

module.exports = {
  signUp,
  signIn,
  userInfo,
  // sendFriendInvitation,
  // acceptFriend,
  // rejectFriend,
  // cancelFriend,
};
