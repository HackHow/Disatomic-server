require('dotenv').config();
const User = require('../models/user');
const { SECRET, EXPIRED } = process.env;
const { jwtSign } = require('../../utils/util');
const argon2 = require('argon2');

const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  const hashPassword = await argon2.hash(password);
  const result = await User.signUp(name, email, hashPassword);

  if (result.error) {
    res.status(403).send(result.error);
    return;
  }

  const jwtToken = await jwtSign({ name, email, password }, SECRET, EXPIRED);
  res.status(200).send({ accessToken: jwtToken, expired: EXPIRED });
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  const result = await User.signIn(email);

  if (result !== null) {
    if (await argon2.verify(result.password, password)) {
      const jwtToken = await jwtSign({ email, password }, SECRET, EXPIRED);
      res
        .status(200)
        .send({ userId: result._id, accessToken: jwtToken, expired: EXPIRED });
      return;
    } else {
      res.status(401).send('Wrong Password');
      return;
    }
  } else {
    res.status(403).send('Email Not Exists');
    return;
  }
};

const profile = async (req, res) => {
  const { userId } = req.body;
  const result = await User.profile(userId);
  console.log('result', result);

  if (result !== null) {
    // console.log(result.name, result.email);
    res.status(200).send({ name: result.name, email: result.email });
  }
};

const sendFriendInvitation = async (req, res) => {
  const { userId, friendName } = req.body;
  const result = await User.sendFriendInvitation(userId, friendName);

  if (result.error) {
    res.status(403).send(result.error);
    return;
  }
  res.status(200).send(result);
  return;
};

const acceptFriend = async (req, res) => {
  const { userId, friendId } = req.body;
  const result = await User.acceptFriend(userId, friendId);

  res.send(result);
};

module.exports = {
  signUp,
  signIn,
  profile,
  sendFriendInvitation,
  acceptFriend,
};
