const conn = require('../../utils/mongodb');
const { User } = require('./schema');

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

    await User.findByIdAndUpdate(
      senderId,
      {
        $addToSet: { outgoingFriendReq: friend._id },
        $set: { updatedAt: Date.now() },
      },
      { new: true }
    ).exec();

    await session.commitTransaction();
    return 'Invite Success';
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    return { error: 'Can not find this user' };
  } finally {
    session.endSession();
  }
};

const acceptInvitation = async (receiverId, senderId) => {
  const session = await conn.startSession();
  try {
    session.startTransaction();
    const { incomingFriendReq } = await User.findByIdAndUpdate(
      receiverId,
      {
        $pull: { incomingFriendReq: senderId },
        $addToSet: { friends: senderId },
      },
      { new: true }
    )
      .populate({ path: 'incomingFriendReq', select: { '_id': 1, 'name': 1 } })
      .exec();

    const { outgoingFriendReq } = await User.findByIdAndUpdate(
      senderId,
      {
        $pull: { outgoingFriendReq: receiverId },
        $addToSet: { friends: receiverId },
      },
      { new: true }
    )
      .populate({ path: 'outgoingFriendReq', select: { '_id': 1, 'name': 1 } })
      .exec();

    await session.commitTransaction();

    return { incomingFriendReq, outgoingFriendReq };
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    return 'Accept Friend Fail';
  } finally {
    session.endSession();
  }
};

const rejectInvitation = async (receiverId, senderId) => {
  const session = await conn.startSession();
  try {
    session.startTransaction();
    const { incomingFriendReq } = await User.findByIdAndUpdate(
      receiverId,
      {
        $pull: { incomingFriendReq: senderId },
      },
      { new: true }
    )
      .populate({ path: 'incomingFriendReq', select: { '_id': 1, 'name': 1 } })
      .exec();

    const { outgoingFriendReq } = await User.findByIdAndUpdate(
      senderId,
      {
        $pull: { outgoingFriendReq: receiverId },
      },
      { new: true }
    )
      .populate({ path: 'outgoingFriendReq', select: { '_id': 1, 'name': 1 } })
      .exec();

    await session.commitTransaction();

    return { incomingFriendReq, outgoingFriendReq };
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    return 'Reject Friend Fail';
  } finally {
    session.endSession();
  }
};

const cancelInvitation = async (senderId, receiverId) => {
  const session = await conn.startSession();
  try {
    session.startTransaction();
    const { outgoingFriendReq } = await User.findByIdAndUpdate(
      senderId,
      {
        $pull: { outgoingFriendReq: receiverId },
      },
      { new: true }
    )
      .populate({ path: 'outgoingFriendReq', select: { '_id': 1, 'name': 1 } })
      .exec();

    const { incomingFriendReq } = await User.findByIdAndUpdate(
      receiverId,
      {
        $pull: { incomingFriendReq: senderId },
      },
      { new: true }
    )
      .populate({ path: 'incomingFriendReq', select: { '_id': 1, 'name': 1 } })
      .exec();

    await session.commitTransaction();

    return { outgoingFriendReq, incomingFriendReq };
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    return 'Cancel Friend Fail';
  } finally {
    session.endSession();
  }
};

const getPendingFriends = async (userId) => {
  try {
    const { outgoingFriendReq, incomingFriendReq } = await User.findById(
      userId
    ).populate({
      path: 'outgoingFriendReq incomingFriendReq',
      select: {
        name: '$name',
      },
    });

    return { outgoingFriendReq, incomingFriendReq };
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

    // console.log('user', user.friends);
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
