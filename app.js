require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const cors = require('cors');
const { API_VERSION, PORT } = process.env;
const Friend = require('./server/models/friend');
const { jwtVerify } = require('./utils/util');
const { SECRET } = process.env;
const Chat = require('./server/models/chat_record');

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.use((req, res, next) => {
  req.io = io;
  next();
});

// API routes
app.use('/api/' + API_VERSION, [
  require('./server/routes/upload_images'),
  require('./server/routes/user'),
  require('./server/routes/friend'),
  require('./server/routes/server'),
  require('./server/routes/channel'),
  require('./server/routes/chat_record'),
]);

// socket.io
// const io = new Server(server, {
//   cors: {
//     origin: 'http://localhost:3000', 'https://dis4tomic.com/',
//     methods: ['GET', 'POST'],
//     credentials: true,
//   },
// });

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
  if (friendList.length > 0) {
    friendList.map((item) => {
      if (allOnlineUser[item.id]) {
        friendInOnline.push({
          socketId: allOnlineUser[item.id],
          friendId: item.id,
          friendName: item.name,
          state: 'online',
        });
      }
    });
  }
  return friendInOnline;
}

function notifyOnline(allOnlineUser, friendList) {
  const friendOnlineSocketIdArray = [];
  if (friendList.length > 0) {
    friendList.map((item) => {
      if (allOnlineUser[item.id]) {
        friendOnlineSocketIdArray.push(allOnlineUser[item.id]);
      }
    });
  }
  return friendOnlineSocketIdArray;
}

io.use(async (socket, next) => {
  let token = socket.handshake.auth.token;
  token = token.replace('Bearer ', '');
  if (token === 'null') return next();

  try {
    const { userId, userName, userChannel } = await jwtVerify(token, SECRET);
    const friends = await Friend.getAllFriends(userId);
    socket.userId = userId;
    socket.userName = userName;
    socket.friends = friends;
    socket.userChannel = userChannel;
  } catch (error) {
    console.log(error);
    next(error);
  }
  next();
});

io.on('connection', (socket) => {
  saveOnlineUser(socket.userId, socket.id);

  console.log(`User Connected: ${socket.id}`);
  // console.log('socket.userId', socket.userId);
  if (!socket.userId) {
    return io.to(socket.id).emit('token', 'No token');
  }

  // send front-end UserInfo component
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

  socket.join(socket.userChannel);

  socket.on('channelSendMessage', async (msg) => {
    msg.userId = socket.userId;
    msg.sender = {};
    msg.sender.name = socket.userName.split('#')[0];

    if (msg.text || msg.files.fileURL || msg.links.linkURL) {
      const {
        userId,
        // senderId: { name },
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
      msg.createdAt = chatRecord.createdAt;
      console.log('MultiChat', msg);

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

      msg.createdAt = chatRecord.createdAt;
      // console.log('Private msg:', msg);
      // console.log('friendSocketId', friendSocketId);

      // socket.join(friendSocketId);

      io.to(friendSocketId).emit('privateReceiveMessage', msg);

      msg.receiver.id = socket.userId;
      io.to(socket.id).emit('privateReceiveMessage', msg);
    }
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
      // io.to(friendOnlineSocketId).emit('OfflineNotify', currentUserInfo);
      io.emit('OfflineNotify', currentUserInfo);
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
