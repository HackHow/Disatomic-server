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
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
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

function getOnlineFriend(allOnlineUser, friendInfo) {
  const friendInOnline = [];
  if (friendInfo.length > 0) {
    friendInfo.map((item) => {
      if (allOnlineUser[item.id]) {
        friendInOnline.push({
          friendId: item.id,
          friendName: item.name,
          state: 'online',
        });
      }
    });
  }
  return friendInOnline;
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
  console.log(`User Connected: ${socket.id}`);
  // console.log('socket.userId', socket.userId);
  if (!socket.userId) {
    return io.to(socket.id).emit('token', 'No token');
  }

  saveOnlineUser(socket.userId, socket.id);

  const friendOnlineList = getOnlineFriend(allOnlineUser, socket.friends);
  socket.on('getOnlineFriend', () => {
    if (friendOnlineList.length > 0) {
      socket.emit('OnlineFriend', friendOnlineList);
    }
  });

  socket.join(socket.userChannel);

  socket.on('channelSendMessage', async (msg) => {
    msg.userId = socket.userId;
    msg.userName = socket.userName.split('#')[0];
    if (msg.text) {
      const {
        userId,
        userName,
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
      msg.dateTime = chatRecord.saveChatRecordTime;
      console.log(msg);

      io.to(msg.channelId).emit('channelReceiveMessage', msg);
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
    deleteOfflineUser(socket.userId);
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
