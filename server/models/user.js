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
    const user = await User.findOne({ email }).exec();

    const { servers } = await User.findById(user._id).populate({
      path: 'servers.serverId',
    });

    let userOwnChannels;
    userOwnChannels = servers.map((item) =>
      item.serverId.channel.map((item) => item._id)
    );

    userOwnChannels = userOwnChannels.flat();

    return { user, userOwnChannels };
  } catch (error) {
    console.log('error:', error.message);
    return { error: error.message };
  }
};

const userInfo = async (userId) => {
  try {
    const { servers } = await User.findById(userId)
      .populate({
        path: 'servers.serverId',
        // select: { serverName: '$serverName' },
      })
      .exec();

    const { friends } = await User.findById(userId).populate({
      path: 'friends',
      select: { _id: 0, name: '$name' },
    });

    // console.log('servers', servers);
    // console.log('friends', friends);

    return { servers, friends };
  } catch (error) {
    return error;
  }
};

module.exports = {
  signUp,
  signIn,
  userInfo,
};
