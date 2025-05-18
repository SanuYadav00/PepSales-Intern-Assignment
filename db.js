const mongoose = require("mongoose");
require('dotenv').config();
const logger = require('./logger');

const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { type: String, enum: ["email", "sms", "in-app"], required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ["pending", "sent", "failed"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model("Notification", notificationSchema);



async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

module.exports = { connectDB, Notification };