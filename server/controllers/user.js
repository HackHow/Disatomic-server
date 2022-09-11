require('dotenv').config();
const User = require('../models/user');
const { SECRET, EXPIRED } = process.env;
const { jwtSign } = require('../../utils/util');

const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  const result = await User.signUp(name, email, password);

  if (result.error) {
    res.status(403).send({ error: result.error });
    return;
  }

  const jwtToken = await jwtSign({ name, email, password }, SECRET, EXPIRED);

  res.status(200).send({ accessToken: jwtToken, expired: EXPIRED });
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  const result = await User.signIn(email, password);
  res.send(result);
};

const profile = async (req, res) => {};

module.exports = { signUp, signIn, profile };
