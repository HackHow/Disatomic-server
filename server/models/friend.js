const conn = require('../../utils/mongodb');
const { User } = require('./schema');

const checkHasFriend = async (senderId, friendName) => {
  try {
    const { friends } = await User.findOne({
      '_id': senderId,
    }).populate({
      path: 'friends',
      match: { 'name': friendName },
      select: { 'name': 1 },
    });

    return friends;
  } catch (error) {
    console.log(error);
    return { error: `You're already friends with that user!` };
  }
};

const sendInvitation = async (senderId, friendName) => {
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
    return `Success! Your friend request to ${friendName} was sent`;
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    return { error: `User not found` };
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
    return { error: 'Accept Friend Fail' };
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
    return { error: 'Reject Friend Fail' };
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
    return { error: 'Cancel Friend Fail' };
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
    return { error: 'Database Query Error' };
  }
};

const getAllFriends = async (userId) => {
  try {
    const { friends } = await User.findById(userId, {
      '_id': 0,
      'friends': 1,
    }).populate({
      path: 'friends',
      select: {
        'name': 1,
      },
    });

    return friends;
  } catch (error) {
    console.log(error);
    return { error: 'Database Query Error' };
  }
};

module.exports = {
  checkHasFriend,
  sendInvitation,
  acceptInvitation,
  rejectInvitation,
  cancelInvitation,
  getPendingFriends,
  getAllFriends,
};
