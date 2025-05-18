const amqp = require("amqplib");
const { connectDB, Notification } = require("./db");

const QUEUE_NAME = "notifications";
const { sendEmail, sendSMS, sendInApp } = require("./senders");

const logger = require('./logger');

async function sendNotification(notification) {
  logger.info(`Sending notification ${notification._id} to user ${notification.userId} via ${notification.type}`);

  switch (notification.type) {
    case "email":
      await sendEmail(notification);
      break;

    case "sms":
      await sendSMS(notification);
      break;

    case "in-app":
      await sendInApp(notification);
      break;

    default:
      throw new Error("Unknown notification type");
  }
}
async function startWorker() {
  try {
    await connectDB();
    const rabbitmqUrl = process.env.RABBITMQ_URL || "amqp://localhost";
    const connection = await amqp.connect(rabbitmqUrl);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: true });
    channel.prefetch(1);

    logger.info("Worker started...");

    channel.consume(QUEUE_NAME, async (msg) => {
      if (msg !== null) {
        const notificationData = JSON.parse(msg.content.toString());

        const notification = await Notification.findById(notificationData._id);

        if (!notification) {
          logger.info("Notification not found, acking");
          channel.ack(msg);
          return;
        }

        try {
          await sendNotification(notification);
          await Notification.findByIdAndUpdate(notification._id, { status: "sent" });
          logger.info(`Notification ${notification._id} sent successfully`);
          channel.ack(msg);
        } catch (error) {
          logger.error(`Failed to send notification ${notification._id}:`, error.message);

          const headers = msg.properties.headers || {};
          const retryCount = headers["x-retry-count"] ? headers["x-retry-count"] : 0;

          if (retryCount < 3) {
            channel.nack(msg, false, false);
            channel.sendToQueue(
              QUEUE_NAME,
              Buffer.from(JSON.stringify(notification)),
              { headers: { "x-retry-count": retryCount + 1 }, persistent: true }
            );
            await Notification.findByIdAndUpdate(notification._id, { status: "failed" });
            logger.info(`Retrying notification ${notification._id}, attempt ${retryCount + 1}`);
          } else {
            await Notification.findByIdAndUpdate(notification._id, { status: "failed" });
            channel.ack(msg);
            logger.info(`Notification ${notification._id} failed after max retries`);
          }
        }
      }
    });
  } catch (error) {
    logger.error("Worker error:", error);
  }
}

startWorker();