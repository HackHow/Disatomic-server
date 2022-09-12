const conn = require('../../utils/mongodb');
const { User, Server } = require('../models/schema');

const createServer = async (userId, serverName) => {
  console.log({ userId, serverName });
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

const deleteServer = (userId, serverName) => {
  try {
    // const server = await User.findOneAndDelete
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { createServer };
