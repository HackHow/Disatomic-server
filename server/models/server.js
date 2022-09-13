const conn = require('../../utils/mongodb');
const { User, Server } = require('../models/schema');

const createServer = async (userId, serverName) => {
  console.log({ 'userId': userId, 'serverName': serverName });
  const session = await conn.startSession();
  try {
    session.startTransaction();
    const server = await Server.create(
      [
        {
          serverName: serverName,
          members: [userId],
        },
      ],
      { session: session }
    );

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          servers: {
            server: serverName,
            serverId: server[0]._id,
          },
        },
      },
      { new: true, session: session }
    ).exec();

    await session.commitTransaction();
    console.log('server', server);
    console.log('--------');
    console.log('user', user);
    return 'Create server success';
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
  } finally {
    session.endSession();
  }
};

const deleteServer = async (userId, serverId) => {
  console.log({ userId, serverId });
  try {
    const server = await Server.findByIdAndDelete(serverId, { new: true });
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          servers: {
            serverId: serverId,
          },
        },
      },
      { new: true }
    ).exec();

    console.log('server', server);
    console.log('user', user);
    return 'Delete success';
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { createServer, deleteServer };
