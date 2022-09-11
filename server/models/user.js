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

const friend = async (userId, friendName) => {
  try {
    const friendId = await User.findOneAndUpdate(
      { name: friendName },
      {
        $addToSet: { pendingFriends: userId },
        $set: { updatedAt: Date.now() },
      },
      { new: true }
    ).exec();

    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        $addToSet: { inviteFriends: friendId._id },
        $set: { updatedAt: Date.now() },
      },
      { new: true }
    ).exec();

    return 'Outgoing Success';
  } catch (error) {
    console.log('error message:', error.message);
    return { error: 'Can not find this user' };
  }
};

module.exports = { signUp, signIn, friend };
