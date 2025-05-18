// logger.js
const { format } = require('date-fns');
const fs = require('fs');
const path = require('path');

// Log levels
const LOG_LEVELS = {
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error'
};

// Log directory setup
const LOG_DIR = path.join(__dirname, 'logs');
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR);
}

// Get current date for log file naming
const getCurrentDate = () => format(new Date(), 'yyyy-MM-dd');
const logFile = path.join(LOG_DIR, `${getCurrentDate()}.log`);

// Log to file function
const logToFile = (level, message) => {
  const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
  
  fs.appendFile(logFile, logEntry, (err) => {
    if (err) console.error('Failed to write to log file:', err);
  });
};

// Logger methods
const logger = {
  info: (message) => {
    const logMessage = typeof message === 'object' ? JSON.stringify(message) : message;
    console.log(logMessage);
    logToFile(LOG_LEVELS.INFO, logMessage);
  },
  
  warn: (message) => {
    const logMessage = typeof message === 'object' ? JSON.stringify(message) : message;
    console.warn(logMessage);
    logToFile(LOG_LEVELS.WARN, logMessage);
  },
  
  error: (message, error = null) => {
    let logMessage = typeof message === 'object' ? JSON.stringify(message) : message;
    if (error) {
      logMessage += `\nError Stack: ${error.stack || error.message || error}`;
    }
    console.error(logMessage);
    logToFile(LOG_LEVELS.ERROR, logMessage);
  }
};

module.exports = logger;