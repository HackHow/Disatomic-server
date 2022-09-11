require('dotenv').config();
const User = require('../models/user');

const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  // console.log('data:', [name, email, password]);
  const result = await User.signUp(name, email, password);
  res.send(result);
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  const result = await User.signIn(email, password);
  res.send(result);
};

const profile = async (req, res) => {};

module.exports = { signUp, signIn, profile };
