require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const cors = require('cors');
const { API_VERSION, PORT } = process.env;

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
  require('./server/routes/server'),
  require('./server/routes/channel'),
]);

// socket.io
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`User Connected ${socket.id}`);

  socket.on('sendMessage', (data) => {
    console.log('front-end sent data', data);

    io.emit('receiveMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on *:${PORT}`);
});
