require('dotenv').config();
const Friend = require('../models/friend');

const sendInvitation = async (req, res) => {
  const { userId } = req.user;
  const { friendName } = req.body;

  if (!/^\w{1,10}#\d{4}$/.test(friendName)) {
    res
      .status(400)
      .send(
        `Didn't work. Please double check the capitalization, spelling, any spaces, and numbers are correct`
      );
    return;
  }

  const checkHasFriend = await Friend.checkHasFriend(userId, friendName);

  if (checkHasFriend.length > 0) {
    res.status(400).send(`You're already friends with that user!`);
    return;
  }

  const result = await Friend.sendInvitation(userId, friendName);

  if (result.error) {
    res.status(404).send(result.error);
    return;
  }

  res.status(200).send(result);
  return;
};

const acceptInvitation = async (req, res) => {
  const { senderId } = req.body;
  const receiverId = req.user.userId;
  const result = await Friend.acceptInvitation(receiverId, senderId);

  if (result.error) {
    res.status(500).send(result.error);
    return;
  }

  res.status(200).send(result);
  return;
};

const rejectInvitation = async (req, res) => {
  const receiverId = req.user.userId;
  const { senderId } = req.body;
  const result = await Friend.rejectInvitation(receiverId, senderId);

  if (result.error) {
    res.status(500).send(result.error);
    return;
  }

  res.status(200).send(result);
  return;
};

const cancelInvitation = async (req, res) => {
  const senderId = req.user.userId;
  const { receiverId } = req.body;
  const result = await Friend.cancelInvitation(senderId, receiverId);

  if (result.error) {
    res.status(500).send(result.error);
    return;
  }

  res.status(200).send(result);
  return;
};

const getPendingFriends = async (req, res) => {
  const { userId } = req.user;
  const result = await Friend.getPendingFriends(userId);

  if (result.error) {
    res.status(500).send(result.error);
    return;
  }

  res.status(200).send({
    outgoingFriendReq: result.outgoingFriendReq,
    incomingFriendReq: result.incomingFriendReq,
  });
  return;
};

const getAllFriends = async (req, res) => {
  const { userId } = req.user;
  const result = await Friend.getAllFriends(userId);

  if (result.error) {
    res.status(500).send(result.error);
    return;
  }

  res.status(200).send({ allFriends: result.friends });
  return;
};

module.exports = {
  sendInvitation,
  acceptInvitation,
  rejectInvitation,
  cancelInvitation,
  getPendingFriends,
  getAllFriends,
};
