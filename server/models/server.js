const conn = require('../../utils/mongodb');
const { User, Server } = require('../models/schema');

const USER_ROLE = {
  0: 'owner',
  1: 'administer',
  2: 'writer',
  3: 'read',
  4: 'null',
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
          roles: { title: USER_ROLE[0], users: [userId] },
        },
      ],
      { session: session }
    ).select();

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          servers: {
            userRoles: server[0].roles[0]._id,
            serverId: server[0]._id,
          },
        },
      },
      { new: true, session: session }
    ).exec();

    await session.commitTransaction();

    return { serverId: server[0]._id };
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

const userOwnServer = async (userId) => {
  try {
    const user = await User.findById(userId);
    // console.log(user);
    // console.log(user.servers);
    return user.servers;
  } catch (error) {
    console.log(error);
    return 'Get Server fail';
  }
};

module.exports = { USER_ROLE, createServer, deleteServer, userOwnServer };
