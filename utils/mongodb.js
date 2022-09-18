require('dotenv').config();
const mongoose = require('mongoose');
const { MONGODB_URI } = process.env;
const uri = MONGODB_URI;

mongoose
  .connect(uri, {
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

// const conn = mongoose.connection;

// const connectDB = async function () {
//   try {
//     await mongoose.connect(url, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       // bufferCommands: false,
//       // bufferMaxEntries: 0
//     });
//     console.log('MongoDB connected!!');
//   } catch (err) {
//     console.log('Failed to connect to MongoDB', err);
//   }
// };

// const TransactionsDB = async () => {
//   try {
//     await mongoose.connect(url, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       //   useFindAndModify: false,
//       //   useCreateIndex: true,
//     });
//     const conn = mongoose.connection;
//     console.log('MongoDB Transaction connected!!');
//   } catch (err) {
//     console.log('Failed to connect to MongoDB', err);
//   }
// };

// const mongoDB = connectDB();
// const conn = TransactionsDB();

module.exports = conn;
