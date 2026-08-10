// This file has ONE job: connect to MongoDB using Mongoose.
// Keeping it separate (instead of inside server.js) means if the
// connection logic ever changes, you only touch this one file.

const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1); // stop the app if we can't connect to the DB
  }
}

module.exports = connectDB;
