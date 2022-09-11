const { mongoDB } = require('../../utils/mongodb');
const { User } = require('../models/schema');

const signUp = async (name, email, password) => {
  try {
    const user = await User.create({
      name: name,
      email: email,
      password: password,
    });
    console.log(user);
    return 'Register Success';
  } catch (error) {
    console.log('error', error.message);
    return { error: 'Email Already Exists', status: 403 };
  }
};

const signIn = async (email, password) => {
  try {
    const user = await User.findOne({ email: email }).exec();
    if (user.email !== null) {
      return 'Login success';
    } else {
      return 'Email not find';
    }
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
};

module.exports = { signUp, signIn };
