require('dotenv').config();
const User = require('../models/friend');

const sendInvitationToFriend = async (req, res) => {
  const { userId } = req.user;
  const { friendName } = req.body;
  const result = await User.sendInvitationToFriend(userId, friendName);

  if (result.error) {
    res.status(403).send(result.error);
    return;
  }
  res.status(200).send(result);
  return;
};

const acceptFriend = async (req, res) => {
  const { receiverId, senderId } = req.body;
  const result = await User.acceptFriend(receiverId, senderId);

  res.send(result);
};

const rejectFriend = async (req, res) => {
  const { receiverId, senderId } = req.body;
  const result = await User.rejectFriend(receiverId, senderId);

  res.send(result);
};

const cancelFriend = async (req, res) => {
  const { senderId, receiverId } = req.body;
  const result = await User.cancelFriend(senderId, receiverId);

  res.send(result);
};

module.exports = {
  sendInvitationToFriend,
  acceptFriend,
  rejectFriend,
  cancelFriend,
};
