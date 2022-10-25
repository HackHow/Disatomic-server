const conn = require('../../utils/mongodb');
const { User } = require('./schema');

const saveAvatarURL = async (userId, avatarURL) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        avatarURL,
      },
      { new: true, select: { 'avatarURL': 1, 'name': 1 } }
    );

    return { user, msg: 'Avatar Upload Successful!!' };
  } catch (error) {
    console.log(error);
    return { error };
  }
};

module.exports = { saveAvatarURL };
