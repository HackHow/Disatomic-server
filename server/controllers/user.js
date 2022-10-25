require('dotenv').config();
const User = require('../models/user');
const { SECRET, EXPIRED } = process.env;
const { jwtSign } = require('../../utils/util');
const argon2 = require('argon2');
const random = require('random');
const validator = require('validator');

const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  if (!validator.isLength(name, { min: 3, max: 10 })) {
    res.status(400).send('User name length must be 3 to 10 character');
    return;
  }

  if (
    !validator.isEmail(email) ||
    validator.isEmpty(email, { ignore_whitespace: true })
  ) {
    res.status(400).send('Invalid Email Format');
    return;
  }

  if (!validator.isLength(password, { min: 6, max: 16 })) {
    res.status(400).send('Password length must be 6 to 16 character');
    return;
  }

  const newName = name + '#' + random.int(1000, 9999);
  const hashPassword = await argon2.hash(password);
  const result = await User.signUp(newName, email, hashPassword);

  if (result.error) {
    res.status(403).send(result.error);
    return;
  }

  const jwtToken = await jwtSign(
    { userId: result._id, userName: result.name },
    SECRET,
    EXPIRED
  );
  res.status(200).send({ accessToken: jwtToken, expired: EXPIRED });
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  if (
    !validator.isEmail(email) ||
    validator.isEmpty(email, { ignore_whitespace: true })
  ) {
    res.status(400).send('Invalid Email Format');
    return;
  }

  if (!validator.isLength(password, { min: 6, max: 16 })) {
    res.status(400).send('Password length must be 6 to 16 character');
    return;
  }

  const result = await User.signIn(email);

  if (result.error) {
    res.status(401).send('Email Not Exists');
    return;
  }

  if (await argon2.verify(result.password, password)) {
    const jwtToken = await jwtSign(
      {
        userId: result._id,
        userAvatar: result.avatarURL,
        userName: result.name,
      },
      SECRET,
      EXPIRED
    );
    res.status(200).send({ accessToken: jwtToken, expired: EXPIRED });
    return;
  } else {
    res.status(403).send('Wrong Password');
    return;
  }
};

const getUserServer = async (req, res) => {
  const { userId } = req.user;
  const result = await User.getUserServer(userId);

  const userServers = [];
  if (result.length > 0) {
    for (let i = 0; i < result.length; i++) {
      userServers.push({
        serverId: result[i].serverId._id,
        serverName: result[i].serverId.serverName,
      });
    }
  }

  res.status(200).send({ userServers });
  return;
};

module.exports = {
  signUp,
  signIn,
  getUserServer,
};
