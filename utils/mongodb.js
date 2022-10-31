require('dotenv').config();
const mongoose = require('mongoose');
const { MONGODB_URI } = process.env;

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    // maxPoolSize: 10,
  })
  .then(() => {
    console.log('MongoDB connected!!');
    console.log('----------------');
  })
  .catch((err) => {
    console.log('Failed to connect to MongoDB', err);
  });

const conn = mongoose.connection;

module.exports = conn;
