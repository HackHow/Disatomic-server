require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const cors = require('cors');
const dayjs = require('dayjs');
const { API_VERSION, PORT, SECRET } = process.env;
const { jwtVerify } = require('./utils/util');
const Friend = require('./server/models/friend');
const Chat = require('./server/models/chat_record');
const Channel = require('./server/models/channel');

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

// API routes
app.use('/api/' + API_VERSION, [
  require('./server/routes/upload_images'),
  require('./server/routes/user'),
  require('./server/routes/friend'),
  require('./server/routes/server'),
  require('./server/routes/channel'),
  require('./server/routes/chat_record'),
]);

const io = new Server(server, {
  cors: '*',
});

const allOnlineUser = {};

function saveOnlineUser(key, value) {
  if (value) {
    allOnlineUser[key] = value;
  }
  // console.log('Save new online User:', allOnlineUser);
}

function deleteOfflineUser(userId) {
  if (allOnlineUser[userId]) {
    delete allOnlineUser[userId];
  }
  // console.log('After Delete Offline User:', allOnlineUser);
}

function getOnlineFriend(allOnlineUser, friendList) {
  const friendInOnline = [];
  for (let i = 0; i < friendList.length; i++) {
    if (allOnlineUser[friendList[i].id]) {
      friendInOnline.push({
        socketId: allOnlineUser[friendList[i].id],
        friendId: friendList[i].id,
        friendName: friendList[i].name,
        state: 'online',
      });
    }
  }
  return friendInOnline;
}

io.use(async (socket, next) => {
  let token = socket.handshake.auth.token;
  token = token.replace('Bearer ', '');
  if (token === 'null') {
    return next(new Error('Not authorized'));
  }

  try {
    const { userId, userName } = await jwtVerify(token, SECRET);
    const result = await Channel.getAllChannel(userId);
    const userChannels = [];
    if (result.length > 0) {
      for (let i = 0; i < result.length; i++) {
        const channel = result[i].serverId.channel;
        if (channel.length > 0) {
          for (let j = 0; j < channel.length; j++) {
            userChannels.push(channel[j].id);
          }
        }
      }
    }
    const { friends } = await Friend.getAllFriends(userId);
    socket.userId = userId;
    socket.userName = userName;
    socket.friends = friends;
    socket.userChannels = userChannels;

    next();
  } catch (error) {
    console.log(error);
    next(new Error('Verify error!'));
  }
});

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);
  saveOnlineUser(socket.userId, socket.id);

  socket.emit('userName', socket.userName);

  const friendOnlineList = getOnlineFriend(allOnlineUser, socket.friends);
  if (friendOnlineList.length > 0) {
    const friendOnlineSocketId = friendOnlineList.map((item) => item.socketId);
    const currentUserInfo = {
      friendId: socket.userId,
      friendName: socket.userName,
      state: 'online',
    };

    io.to(friendOnlineSocketId).emit('onlineNotify', currentUserInfo);
  }

  socket.on('getOnlineFriend', () => {
    if (friendOnlineList.length > 0) {
      socket.emit('onlineFriend', friendOnlineList);
    }
  });

  socket.join(socket.userChannels);

  socket.on('channelSendMessage', async (msg) => {
    msg.userId = socket.userId;
    msg.sender = {};
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
  });

  socket.on('privateSendMessage', async (msg) => {
    msg.sender = {};
    msg.sender.id = socket.userId;
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
  });

  socket.on('joinCreatedChannel', (channelId) => {
    // console.log('channelId', channelId);
    socket.join(channelId);
  });

  socket.on('NotifyAcceptFriend', ({ senderId, outgoingFriendReq }) => {
    const senderSocketId = allOnlineUser[senderId] || '';
    io.to(senderSocketId).emit('NotifySenderAccept', outgoingFriendReq);
  });

  socket.on('NotifyRejectFriend', ({ senderId, outgoingFriendReq }) => {
    const senderSocketId = allOnlineUser[senderId] || '';
    io.to(senderSocketId).emit('NotifySenderReject', outgoingFriendReq);
  });

  socket.on('NotifyCancelFriend', ({ receiverId, incomingFriendReq }) => {
    const receiverSocketId = allOnlineUser[receiverId] || '';
    io.to(receiverSocketId).emit('NotifyReceiverCancel', incomingFriendReq);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
    deleteOfflineUser(socket.userId);

    if (friendOnlineList.length > 0) {
      const friendOnlineSocketId = friendOnlineList.map(
        (item) => item.socketId
      );

      // console.log('friendOnlineSocketId', friendOnlineSocketId);
      const currentUserInfo = {
        friendId: socket.userId,
        friendName: socket.userName,
        state: 'offline',
      };
      io.to(friendOnlineSocketId).emit('OfflineNotify', currentUserInfo);
    }

    console.log('================');
  });
});

app.use(function (err, req, res, next) {
  console.log(err);
  res.status(500).send('Internal Server Error');
});

server.listen(PORT, () => {
  console.log(`Server listening on *:${PORT}`);
});

module.exports = app;
