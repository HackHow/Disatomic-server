const { User } = require('../../server/models/schema');

const getAllFriends = async (userId) => {
  try {
    const { friends } = await User.findById(userId, {
      '_id': 0,
      'friends': 1,
    }).populate({
      path: 'friends',
      select: {
        'name': 1,
        'avatarURL': 1,
      },
    });

    return { friends };
  } catch (error) {
    console.log(error);
    return { error: 'Database Query Error' };
  }
};

module.exports = { getAllFriends };
