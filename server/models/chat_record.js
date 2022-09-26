const conn = require('../../utils/mongodb');
// const { User } = require('../models/schema');
const { User, MultiChat, Server } = require('../models/test');
const dayjs = require('dayjs');
const { model } = require('mongoose');

const saveMultiChatRecord = async (senderId, text, links, files, channelId) => {
  // const session = await conn.startSession();
  // console.log('links', links);
  // console.log('files', files);
  try {
    // session.startTransaction();
    const chat = await MultiChat.create({
      senderId: senderId,
      text: text,
      links: {
        linkURL: links,
      },
      files: {
        fileURL: files,
      },
    });

    const dateTime = dayjs(chat.createdAt).format('MM/DD/YYYY HH:mm');

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

    // await session.commitTransaction();
    return { saveChatRecordTime: dateTime };
  } catch (error) {
    // await session.abortTransaction();
    console.log(error);
    return error;
  } finally {
    // session.endSession();
  }
};

const getMultiChatRecord = async (serverId, channelId) => {
  try {
    const chat = await Server.find(
      { 'channel._id': channelId },
      { 'channel.$': 1 }
    ).populate({
      path: 'channel.chatRecord',
      select: { '_id': 0 },
      populate: {
        path: 'senderId',
        select: { 'name': 1, '_id': 0 },
      },
    });

    const chatRecord = chat[0].channel[0].chatRecord;
    // console.log(chatRecord);
    // const test = chatRecord.map((item) => item.senderId.name);
    // console.log(test);

    return 'ok';
  } catch (error) {
    console.log(error);
    return { error };
  }
};

module.exports = { saveMultiChatRecord, getMultiChatRecord };
