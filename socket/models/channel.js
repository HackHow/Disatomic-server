const { User } = require('../../server/models/schema');

const getAllChannel = async (userId) => {
  try {
    const { servers } = await User.findById(userId, { 'servers': 1 }).populate({
      path: 'servers.serverId',
      select: { 'channel': 1 },
    });

    return servers;
  } catch (error) {
    console.log(error);
    return { error: 'Database Query Error' };
  }
};

module.exports = { getAllChannel };
