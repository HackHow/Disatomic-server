const { mongoDB } = require('../../utils/mongodb');
const { User } = require('../models/schema');

const signUp = async (name, email, password) => {
  try {
    const user = await User.create({
      name,
      email,
      password,
    });
    console.log(user);
    return 'Register Success';
  } catch (error) {
    console.log('error', error.message);
    return { error: 'Email Already Exists' };
  }
};

const signIn = async (email) => {
  try {
    const user = await User.findOne({ email }).exec();
    return user;
  } catch (error) {
    console.log('error:', error.message);
    return { error: error.message };
  }
};

module.exports = { signUp, signIn };
