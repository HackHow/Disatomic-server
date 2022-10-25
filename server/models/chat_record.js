const conn = require('../../utils/mongodb');
const { MultiChat, Server, PersonalChat } = require('./schema');
const dayjs = require('dayjs');

const saveMultiChatRecord = async (senderId, text, links, files, channelId) => {
  // const filesArray = files.map((item) => {
  //   return { fileURL: item.fileURL };
  // });

  // const linksArray = files.map((item) => {
  //   return { linkURL: item.linkURL };
  // });
  const session = await conn.startSession();
  try {
    session.startTransaction();
    const chat = await MultiChat.create({
      sender: senderId,
      text: text,
      links: {
        linkURL: links,
      },
      files: {
        fileURL: files,
      },
    });

    await Server.findOneAndUpdate(
      {
        'channel._id': channelId,
      },
      {
        $addToSet: {
          'channel.$.chatRecord': {
            _id: chat._id,
          },
        },
      },
      { new: true }
    );

    await session.commitTransaction();
    return { createdAt: chat.createdAt };
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    return { error };
  } finally {
    session.endSession();
  }
};

const getMultiChatRecord = async (channelId) => {
  try {
    const chat = await Server.find(
      { 'channel._id': channelId },
      { 'channel.$': 1 }
    ).populate({
      path: 'channel.chatRecord',
      select: { '_id': 0 },
      populate: {
        path: 'sender',
        select: { 'name': 1, '_id': 0, 'avatarURL': 1 },
      },
    });

    return chat;
  } catch (error) {
    console.log(error);
    return { error };
  }
};

const savePersonalChatRecord = async (
  senderId,
  receiverId,
  text,
  links,
  files
) => {
  try {
    const chat = await PersonalChat.create({
      sender: senderId,
      receiver: receiverId,
      text: text,
      links: {
        linkURL: links,
      },
      files: {
        fileURL: files,
      },
    });

    return chat;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const getPersonalChatRecord = async (senderId, receiverId) => {
  try {
    const chat = await PersonalChat.find({
      $or: [
        { $and: [{ sender: senderId }, { receiver: receiverId }] },
        { $and: [{ sender: receiverId }, { receiver: senderId }] },
      ],
    }).populate({
      path: 'sender receiver',
      select: { 'name': 1, 'id': 1, 'avatarURL': 1 },
    });

    // console.log(chat);
    return chat;
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = {
  saveMultiChatRecord,
  getMultiChatRecord,
  savePersonalChatRecord,
  getPersonalChatRecord,
};
