const conn = require('../../utils/mongodb');
const { User } = require('./schema');

const signUp = async (name, email, password) => {
  try {
    const user = await User.create({
      name,
      email,
      password,
    });
    console.log('Register Success');
    return user;
  } catch (error) {
    console.log('error', error.message);
    return { error: 'Email Already Exists' };
  }
};

const signIn = async (email) => {
  try {
    const { _id, name, password } = await User.findOne(
      { email },
      '_id name password servers'
    );

    return { _id, name, password };
  } catch (error) {
    console.log('error:', error.message);
    return { error: error.message };
  }
};

const getUserServer = async (userId) => {
  try {
    const { servers } = await User.findById(userId).populate({
      path: 'servers.serverId',
      select: { '_id': 1, 'serverName': 1 },
    });

    return servers;
  } catch (error) {
    return { error: error.message };
  }
};

module.exports = {
  signUp,
  signIn,
  getUserServer,
};
