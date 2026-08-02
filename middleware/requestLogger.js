const fs = require("fs");
const path = require("path");

const logFilePath = path.join(__dirname, "../logs/log.txt");

const requestLogger = (req, res, next) => {
  const log = `
        Time   : ${new Date().toLocaleString()}
        Method : ${req.method}
        URL    : ${req.originalUrl}
        IP     : ${req.ip}
    `;

  fs.appendFile(logFilePath, log, (error) => {
    if (error) {
      console.error("Error writing to log file:", error);
    }
  });

  next();
};

module.exports = requestLogger;
