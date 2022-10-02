require('dotenv').config();
const User = require('../models/user');
const { SECRET, EXPIRED } = process.env;
const { jwtSign } = require('../../utils/util');
const argon2 = require('argon2');
const random = require('random');
const validator = require('validator');

const signUp = async (req, res) => {
  const { name, email, password } = req.body;
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

  if (!validator.isEmail(email)) {
    res.status(400).send('Invalid email format');
    return;
  }

  const { user, userOwnChannels } = await User.signIn(email);

  if (user !== null) {
    if (await argon2.verify(user.password, password)) {
      const jwtToken = await jwtSign(
        { userId: user._id, userName: user.name, userChannel: userOwnChannels },
        SECRET,
        EXPIRED
      );
      res.status(200).send({ accessToken: jwtToken, expired: EXPIRED });
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

const userInfo = async (req, res) => {
  const { userId } = req.user;
  const { servers, friends } = await User.userInfo(userId);

  if (servers === undefined || friends === undefined) {
    res.status(403).send('User ID not found');
    return;
  }

  const userOwnServer = servers.map((item) => {
    return {
      serverId: item.serverId._id,
      serverName: item.serverId.serverName,
    };
  });

  console.log(userOwnServer);

  res.status(200).send({ userId, userOwnServer });
  return;
};

module.exports = {
  signUp,
  signIn,
  userInfo,
};
