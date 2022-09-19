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
  const { receiverId, senderId } = req.body;
  // const { userId } = req.user;
  const result = await Friend.acceptInvitation(receiverId, senderId);

  res.status(200).send(result);
};

const rejectInvitation = async (req, res) => {
  const { receiverId, senderId } = req.body;
  const result = await Friend.rejectInvitation(receiverId, senderId);

  res.send(result);
};

const cancelInvitation = async (req, res) => {
  const { senderId, receiverId } = req.body;
  const result = await Friend.cancelInvitation(senderId, receiverId);

  res.send(result);
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

  const friendsName = result.map((item) => item.name);

  res.status(200).send(friendsName);
};

module.exports = {
  sendInvitationToFriend,
  acceptInvitation,
  rejectInvitation,
  cancelInvitation,
  getPendingFriends,
  getAllFriends,
};
