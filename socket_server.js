require('dotenv').config();
const app = require('./app');
const { createServer } = require('http');
const httpServer = createServer(app);
const { Server } = require('socket.io');
const { getAllChannel } = require('./socket/controllers/channel');
const {
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
} = require('./socket/controllers/friend');

const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'https://dis4tomic.com'],
  },
});

io.use(async (socket, next) => {
  let token = socket.handshake.auth.token;
  try {
    const { userId, userAvatar, userName } = await socketAuth(token);
    const userChannels = await getAllChannel(userId);
    const { friends } = await getAllFriends(userId);

    socket.userId = userId;
    socket.userAvatar = userAvatar;
    socket.userName = userName;
    socket.friends = friends;
    socket.userChannels = userChannels;

    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

const allOnlineUser = {};
const neww = {};

io.on('connection', (socket) => {
  console.log(
    `User Connected:    ${socket.id}`,
    `***${new Date().toISOString()}***`
  );
  allOnlineUser[socket.userId] = socket.id;

  socket.emit('userName', socket.userName);
  socket.emit('userAvatar', socket.userAvatar);

  let friendOnlineList = getOnlineFriend(allOnlineUser, socket.friends);

  socket.on('getOnlineFriend', onlineFriend(friendOnlineList));

  onlineNotify(friendOnlineList);

  addOnlineFriendToList(allOnlineUser, socket.friends);
  socket.on('channelSendMessage', channelSendMessage);

  socket.on('disconnect', () => {
    console.log(
      `User disconnected: ${socket.id}`,
      `***${new Date().toISOString()}***`
    );
    delete allOnlineUser[socket.userId];

    console.log('================');
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}...`);
});
