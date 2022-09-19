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

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/public/index.html');
// });

// API routes
app.use('/api/' + API_VERSION, [
  require('./server/routes/upload_images'),
  require('./server/routes/user'),
  require('./server/routes/friend'),
  require('./server/routes/server'),
  require('./server/routes/channel'),
]);

// socket.io
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const usersInfo = {};

function saveOnlineUser(key, value) {
  if (value) {
    usersInfo[key] = value;
  }
  // console.log('Save new online User:', usersInfo);
}

function deleteOfflineUser(userId) {
  if (usersInfo[userId]) {
    delete usersInfo[userId];
  }
  // console.log('After Delete Offline User:', usersInfo);
}

function getOnlineFriend(friendList, allOnlineUser) {
  const friendOnlineList = [];
  console.log('friendList', friendList);
  if (friendList.length > 0) {
    friendList.map((item) => {
      if (allOnlineUser[item]) {
        friendOnlineList.push(allOnlineUser[item]);
      }
    });
  }
  console.log('friendOnlineList:', friendOnlineList);
  return friendOnlineList;
}

io.use(async (socket, next) => {
  let token = socket.handshake.auth.token;
  if (!token) return next(new Error('test!!'));

  let userFriendId;

  try {
    token = token.replace('Bearer ', '');
    const { userId, userName } = await jwtVerify(token, SECRET);
    socket.userId = userId;
    socket.userName = userName;
    const friends = await Friend.getAllFriends(userId);

    if (friends.length !== 0) {
      userFriendId = friends.map((item) => item._id);
    } else {
      userFriendId = [];
    }

    socket.userFriendId = userFriendId;
  } catch (error) {
    console.log(error);
    next(error);
  }
  next();
});

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);
  saveOnlineUser(socket.userId, socket.id);
  const friendOnlineList = getOnlineFriend(socket.userFriendId, usersInfo);

  if (friendOnlineList.length > 0) {
    socket.to(friendOnlineList).emit('friendState', {
      socketId: socket.id,
      userName: socket.userName,
      state: 'online',
    });
  }

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
    deleteOfflineUser(socket.userId);
    // deleteOfflineFriend(friendOnlineList, socket.id);
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
