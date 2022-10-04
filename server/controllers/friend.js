require('dotenv').config();
const Friend = require('../models/friend');

const sendInvitationToFriend = async (req, res) => {
  const { userId } = req.user;
  const { friendName } = req.body;
  const result = await Friend.sendInvitationToFriend(userId, friendName);

  if (result.error) {
    res.status(403).send(result.error);
    return;
  }

  res.status(200).send(result);
  return;
};

const acceptInvitation = async (req, res) => {
  const { senderId } = req.body;
  const receiverId = req.user.userId;
  const result = await Friend.acceptInvitation(receiverId, senderId);

  res.status(200).send(result);
  return;
};

const rejectInvitation = async (req, res) => {
  const receiverId = req.user.userId;
  const { senderId } = req.body;
  const result = await Friend.rejectInvitation(receiverId, senderId);

  if (result.error) {
    res.status(403).send(result.error);
    return;
  }

  // console.log('result', result);

  res.status(200).send(result);
};

const cancelInvitation = async (req, res) => {
  const senderId = req.user.userId;
  const { receiverId } = req.body;
  const result = await Friend.cancelInvitation(senderId, receiverId);

  if (result.error) {
    res.status(403).send(result.error);
    return;
  }

  res.status(200).send(result);
  return;
};

const getPendingFriends = async (req, res) => {
  const { userId } = req.user;
  const result = await Friend.getPendingFriends(userId);

  if (result.error) {
    res.status(500).send({ error: 'Database Query Error' });
    return;
  }

  const outgoingRequest = result.outgoingRequest;
  const incomingRequest = result.incomingRequest;

  res.status(200).send({ outgoingRequest, incomingRequest });
  return;
};

const getAllFriends = async (req, res) => {
  const { userId } = req.user;
  const result = await Friend.getAllFriends(userId);

  if (result.error) {
    res.status(500).send({ error: 'Database Query Error' });
    return;
  }

  res.status(200).send(result);
  return;
};

module.exports = {
  sendInvitationToFriend,
  acceptInvitation,
  rejectInvitation,
  cancelInvitation,
  getPendingFriends,
  getAllFriends,
};
