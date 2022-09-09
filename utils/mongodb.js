const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017';
// const url = process.env['MONGODB_URI'];

const connectDB = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //   useFindAndModify: false,
      //   useCreateIndex: true,
    });
    console.log('MongoDB connected!!');
  } catch (err) {
    console.log('Failed to connect to MongoDB', err);
  }
};

const mongoDB = connectDB();

module.exports = { mongoDB };
