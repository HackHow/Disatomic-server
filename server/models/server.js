const conn = require('../../utils/mongodb');
const { User, Server } = require('./schema');

const USER_ROLE = {
  0: 'owner',
  1: 'administrator',
  2: 'writer',
  3: 'reader',
};

const createServer = async (userId, serverName) => {
  const session = await conn.startSession();
  try {
    session.startTransaction();
    const server = await Server.create(
      [
        {
          serverName: serverName,
          members: [userId],
          roles: [
            {
              permission: USER_ROLE[0],
              usersId: [userId],
            },
            {
              permission: USER_ROLE[1],
            },
            {
              permission: USER_ROLE[2],
            },
            {
              permission: USER_ROLE[3],
            },
          ],
        },
      ],
      { session: session }
    );

    await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          servers: {
            userPermission: server[0].roles[0]._id,
            serverId: server[0]._id,
          },
        },
      },
      { new: true, session: session }
    ).exec();

    await session.commitTransaction();
    return { serverId: server[0]._id, serverName: server[0].serverName };
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    return { error };
  } finally {
    session.endSession();
  }
};

const deleteServer = async (userId, serverId) => {
  const session = await conn.startSession();
  try {
    session.startTransaction();

    const server = await Server.findByIdAndDelete(serverId, {
      new: true,
      session: session,
    });
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          servers: {
            serverId: serverId,
          },
        },
      },
      { new: true, session: session }
    ).exec();

    await session.commitTransaction();
    console.log(server);
    console.log('--------');
    console.log(user);
    console.log('deleteServer transaction success');

    return { server, user };
  } catch (error) {
    await session.abortTransaction();
    console.log(error.message);
  } finally {
    session.endSession();
  }
};

const getChannelOfServer = async (serverId) => {
  try {
    const server = await Server.findById(serverId);
    // console.log(server);
    return server;
  } catch (error) {
    console.log('ERROR:', error);
    return { error };
  }
};

module.exports = {
  USER_ROLE,
  getChannelOfServer,
  createServer,
  deleteServer,
};
