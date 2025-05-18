const express = require("express"); // Importing express
const bodyParser = require("body-parser");
const amqp = require("amqplib");
const { connectDB, Notification } = require("./db");

const app = express();
const PORT = 3000;
const QUEUE_NAME = "notifications";

app.use(bodyParser.json());

const logger = require('./logger');

let channel, connection;

async function connectQueue() {
  const rabbitmqUrl = process.env.RABBITMQ_URL || "amqp://localhost";   
  connection = await amqp.connect(rabbitmqUrl);
  channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME, { durable: true });
  logger.info("Connected to RabbitMQ");
}

app.get("/",(req,res) => {
  res.send("Service is working");
});

app.post("/notifications", async (req, res) => {
  const { userId, type, message } = req.body;

  if (!userId || !type || !message) {
    return res.status(400).json({ error: "userId, type, and message are required" });
  }

  try {
    const notification = new Notification({ userId, type, message });
    await notification.save();

    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(notification)), { persistent: true });

    res.status(201).json({ message: "Notification queued", notification });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/users/:id/notifications", async (req, res) => {
  const userId = req.params.id;

  try {
    const userNotifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.json(userNotifications);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, async () => {
  try {
    await connectDB();
    await connectQueue();
    logger.info(`Server running on http://localhost:${PORT}`);
  } catch (error) {
    logger.error("Failed to start server", error);
  }
});
