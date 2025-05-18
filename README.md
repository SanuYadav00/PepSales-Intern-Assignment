# PepSales Notification Service

A robust backend notification system for sending **Email**, **SMS**, and **In-App** notifications to users, built with **Node.js**, **Express**, **MongoDB**, and **RabbitMQ**.  
Supports real delivery for Email (via Gmail) and SMS (via Twilio), with in-app notifications stored in the database.  
Implements queue-based processing and automatic retries for failed notifications.

---

## 🚀 Features

- **Send notifications** to users via Email, SMS, or In-App.
- **Queue-based processing** using RabbitMQ for scalability and reliability.
- **Automatic retries** for failed notifications (up to 3 attempts).
- **API Endpoints** for sending and retrieving notifications.
- **Structured logging** to file and console.
- **Environment-based configuration** for credentials and services.

---

## 📋 Assignment Requirements & Solution Mapping

| Requirement                                    | Implemented? | Details                               |
|------------------------------------------------|--------------|---------------------------------------|
| POST /notifications                            | ✅           | Enqueues notification for processing  |
| GET /users/{id}/notifications                  | ✅           | Fetches all notifications for a user  |
| Email, SMS, In-App notification types          | ✅           | Real email/SMS, DB for in-app         |
| Use queue (RabbitMQ) for processing            | ✅           | Producer/worker architecture          |
| Retries for failed notifications               | ✅           | 3 attempts with status tracking       |

---

## 🛠️ Tech Stack

- **Node.js** & **Express.js**
- **MongoDB** (Mongoose)
- **RabbitMQ** (amqplib)
- **Nodemailer** (Gmail SMTP)
- **Twilio** (SMS)
- **dotenv** (Environment config)
- **date-fns** (Date formatting)
- **Winston** (Logging)
- **Custom logger** (logs to file and console)

---

## 📦 Installation & Setup

### 1. **Clone the repository**
git clone https://github.com/YOUR_USERNAME/pepsale-notification-service.git
cd pepsale-notification-service

text

### 2. **Install dependencies**
npm install

text

### 3. **Set up MongoDB and RabbitMQ**
- **MongoDB:**  
  - Install and start MongoDB locally, or use a cloud MongoDB URI.
- **RabbitMQ:**  
  - Install and start RabbitMQ locally, or use a cloud RabbitMQ URI.

### 4. **Configure environment variables**

Create a `.env` file in the project root:
<pre>
MONGODB_URI=mongodb://127.0.0.1:27017/pepsales
RABBITMQ_URL=amqp://127.0.0.1

Email (Gmail SMTP)
EMAIL_USER=your.email@gmail.com
EMAIL_PASS=your_gmail_app_password

Twilio (SMS)
TWILIO_SID=your_twilio_account_sid
TWILIO_AUTH=your_twilio_auth_token
TWILIO_PHONE=your_twilio_phone_number
</pre>


- For **EMAIL_PASS**, generate a Gmail App Password ([instructions](https://support.google.com/accounts/answer/185833?hl=en)).
- For **Twilio**, get your credentials and phone number from the [Twilio Console](https://www.twilio.com/console).

### 5. **Start the API server**
`npm start`
or (if you use nodemon for development)
`npm run dev`

### 6. **Start the worker**
node worker.js
---

## 🧑‍💻 API Endpoints

### **Send Notification**
- **POST** `/notifications`
- **Body:**
<pre>{
"userId": "user@example.com or phone number or userId",
"type": "email" | "sms" | "in-app",
"message": "Your notification message"
}</pre>

- **Response:** Queues the notification for processing.

### **Get User Notifications**
- **GET** `/users/:id/notifications`
- **Response:** Returns all notifications for the specified user.

---

## ⚙️ How It Works

- **API server** receives notification requests and enqueues them in RabbitMQ.
- **Worker process** consumes the queue and sends notifications:
- **Email:** via Gmail SMTP (Nodemailer).
- **SMS:** via Twilio.
- **In-App:** logs/stores in MongoDB.
- **Retries:** If delivery fails, the worker retries up to 3 times before marking as failed.
- **Logging:** All actions and errors are logged to both console and daily log files.

---

## 📁 Project Structure

<pre>
├── db.js # MongoDB connection and Notification model
├── index.js # Express API server, queue producer
├── logger.js # Custom logger (file + console)
├── package.json
├── senders.js # Email/SMS/In-app senders
├── worker.js # Queue consumer/worker
├── .env.example # Sample environment config
└── README.md
</pre>

---

## 📝 Assumptions

- **userId** in notifications is the recipient’s email (for email), phone number (for SMS), or user ID (for in-app).
- Only valid, existing users/emails/phone numbers should be used for real delivery.
- Email sending uses Gmail SMTP. For production, use a dedicated email account and secure app password.
- SMS sending uses Twilio. Free accounts can only send to verified numbers.
- In-app notifications are stored in MongoDB and retrievable via the API.

---

## 🧪 Testing

- Use **Postman**, **Hoppscotch**, or **curl** to test API endpoints.
- Check your email inbox or SMS phone for real notifications.
- Review logs in the `logs/` directory for delivery status and errors.

---

## 🚨 Error Handling & Retries

- If a notification fails to send, it is retried up to 3 times.
- After 3 failures, the notification status is set to `"failed"` in MongoDB.

---

## 📄 License

This project is for the PepSales internship assignment and is provided for educational/demo purposes.

---

## 🙋‍♂️ Questions or Issues?

- For setup issues, first check your `.env` file and service credentials.
- For code or feature questions, please contact [YOUR EMAIL] or open an issue on GitHub.

---
