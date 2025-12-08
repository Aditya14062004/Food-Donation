const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);  // use MONGO_URI not MONGODB_URI
    console.log("Connected to MongoDB server");
  } catch (err) {
    console.log("MongoDB connection error:", err);
    process.exit(1);
  }

  const db = mongoose.connection;

  db.on("disconnected", () => {
    console.log("MongoDB disconnected");
  });
};

module.exports = connectDB;