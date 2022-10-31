require('dotenv').config();
const Friend = require('../models/friend');

const getAllFriends = async (userId) => {
  const result = await Friend.getAllFriends(userId);

  if (result.error) {
    throw new Error(result.error);
  }

  return { friends: result.friends };
};

function getOnlineFriend(allOnlineUser, friendList) {
  const friendInOnline = [];
  for (let i = 0; i < friendList.length; i++) {
    if (allOnlineUser[friendList[i].id]) {
      friendInOnline.push({
        socketId: allOnlineUser[friendList[i].id],
        friendAvatarURL: friendList[i].avatarURL,
        friendId: friendList[i].id,
        friendName: friendList[i].name,
        state: 'online',
      });
    }
  }
  return friendInOnline;
}

const onlineFriend = (friendOnlineList) => {
  if (friendOnlineList.length > 0) {
    socket.emit('onlineFriend', friendOnlineList);
  }
};

const onlineNotify = (friendOnlineList) => {
  if (friendOnlineList.length > 0) {
    const friendOnlineSocketId = friendOnlineList.map((item) => item.socketId);

    const currentUserInfo = {
      socketId: socket.id,
      friendAvatarURL: socket.userAvatar,
      friendId: socket.userId,
      friendName: socket.userName,
      state: 'online',
    };

    io.to(friendOnlineSocketId).emit('onlineNotify', currentUserInfo);
  }
};

const addOnlineFriendToList = (allOnlineUser, friends) => {
  friendOnlineList = getOnlineFriend(allOnlineUser, friends);
};

const channelSendMessage = async (msg) => {
  msg.userId = socket.userId;
  msg.sender = {};
  msg.sender.avatarURL = socket.userAvatar;
  msg.sender.name = socket.userName.split('#')[0];

  if (msg.text || msg.files.fileURL || msg.links.linkURL) {
    const {
      userId,
      text,
      channelId,
      links: { linkURL },
      files: { fileURL },
    } = msg;

    const chatRecord = await Chat.saveMultiChatRecord(
      userId,
      text,
      linkURL,
      fileURL,
      channelId
    );
    msg.createdAt = dayjs(chatRecord.createdAt).format('MM/DD/YYYY HH:mm');
    // console.log('MultiChat', msg);

    io.to(msg.channelId).emit('channelReceiveMessage', msg);
  }
};

const privateSendMessage = async (msg) => {
  msg.sender = {};
  msg.sender.id = socket.userId;
  msg.sender.avatarURL = socket.userAvatar;
  msg.sender.name = socket.userName.split('#')[0];

  let friendSocketId;
  if (allOnlineUser[msg.receiver.id] !== undefined) {
    friendSocketId = allOnlineUser[msg.receiver.id]; //string
  } else {
    friendSocketId = '';
  }

  if (msg.text || msg.files.fileURL || msg.links.linkURL) {
    const {
      sender,
      receiver,
      text,
      links: { linkURL },
      files: { fileURL },
    } = msg;

    const chatRecord = await Chat.savePersonalChatRecord(
      sender.id,
      receiver.id,
      text,
      linkURL,
      fileURL
    );
    msg.createdAt = dayjs(chatRecord.createdAt).format('MM/DD/YYYY HH:mm');

    io.to(friendSocketId).emit('privateReceiveMessage', msg);

    msg.receiver.id = socket.userId;
    io.to(socket.id).emit('privateReceiveMessage', msg);
  }
};

const joinCreatedChannel = async ({
  serverMembers,
  channelId,
  channelName,
}) => {
  socket.join(channelId);

  // except create channel user
  const membersInServer = serverMembers.filter(
    (item) => item !== socket.userId
  );

  let membersSocketId = [];
  for (let i = 0; i < membersInServer.length; i++) {
    membersSocketId.push(allOnlineUser[membersInServer[i]]);
  }

  if (membersSocketId.length > 0) {
    io.to(membersSocketId).emit('renderChannelForMembers', {
      channelId,
      channelName,
    });
  }
};

const serverMembersJoinChannel = (channelId) => {
  socket.join(channelId);
};

const NotifyAcceptFriend = ({ senderId, outgoingFriendReq }) => {
  const senderSocketId = allOnlineUser[senderId] || '';
  io.to(senderSocketId).emit('NotifySenderAccept', outgoingFriendReq);
};

const NotifyRejectFriend = ({ senderId, outgoingFriendReq }) => {
  const senderSocketId = allOnlineUser[senderId] || '';
  io.to(senderSocketId).emit('NotifySenderReject', outgoingFriendReq);
};
const NotifyCancelFriend = ({ receiverId, incomingFriendReq }) => {
  const receiverSocketId = allOnlineUser[receiverId] || '';
  io.to(receiverSocketId).emit('NotifyReceiverCancel', incomingFriendReq);
};

const InviteFriendToChannel = ({ receiverId, userServers, channelList }) => {
  if (receiverId !== undefined) {
    const receiverSocketId = allOnlineUser[receiverId] || '';
    const channelIdArray = channelList.map((item) => item.channelId);
    io.to(receiverSocketId).emit('receiverRenderServerAndChannel', {
      userServers,
      channelList,
      channelIdArray,
    });
  }
};

const receiverJoinChannel = (channelIdArray) => {
  socket.join(channelIdArray);
};

const OfflineNotify = () => {
  if (friendOnlineList.length > 0) {
    const friendOnlineSocketId = friendOnlineList.map((item) => item.socketId);

    const currentUserInfo = {
      friendId: socket.userId,
      friendName: socket.userName,
      state: 'offline',
    };

    io.to(friendOnlineSocketId).emit('OfflineNotify', currentUserInfo);
  }
};

module.exports = {
  getAllFriends,
  getOnlineFriend,
  onlineFriend,
  onlineNotify,
  addOnlineFriendToList,
  channelSendMessage,
  joinCreatedChannel,
  serverMembersJoinChannel,
  NotifyAcceptFriend,
  NotifyRejectFriend,
  NotifyCancelFriend,
  InviteFriendToChannel,
  receiverJoinChannel,
  OfflineNotify,
};
