require('dotenv').config(); // Load environment variables from .env file

const nodemailer = require("nodemailer");
const twilio = require("twilio");
const logger = require('./logger');

// Configure email transporter using environment variables
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// Configure Twilio client using environment variables
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

async function sendEmail(notification) {
  const mailOptions = {
    from: `"Notif Service" <${process.env.EMAIL_USER}>`,
    to: notification.userId, // assume userId is email for demo
    subject: "Notification",
    text: notification.message,
  };

  await transporter.sendMail(mailOptions);
  logger.info(`Email sent to ${notification.userId}`);
}

async function sendSMS(notification) {
  await twilioClient.messages.create({
    body: notification.message,
    from: process.env.TWILIO_PHONE,   // e.g. +17543152003
    to: notification.userId,
  });
  logger.info(`SMS sent to ${notification.userId}`);
}

async function sendInApp(notification) {
  logger.info(`In-App notification for ${notification.userId}: ${notification.message}`);
}

module.exports = { sendEmail, sendSMS, sendInApp };
