const winston = require('winston');
const { createLogger, transports, format } = winston;
require('winston-daily-rotate-file');
const config = require('../config');

const { combine, label, timestamp, printf, colorize } = format;

/**
 * creates a logger
 * @param {string} name name of the object/class
 * @return {import("winston").Logger} winston logger object
 */
function getLogger(name) {
  const consoleTransport = new transports.Console({
    level: config.logs.level || 'debug',
    format: combine(
      timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      colorize(),
      label({ label: name }),
      printf(({ timestamp, label, level, message }) => `${timestamp} [${label}] ${level}: ${message}`),
    ),
  });

  const fileTransport = new winston.transports.DailyRotateFile({
    filename: '%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '7d',
    level: 'info',
    format: combine(
      timestamp(),
      colorize(),
      label({ label: name }),
      printf(({ timestamp, label, level, message }) => `${timestamp} [${label}] ${level}: ${message}`),
    ),
  });

  const logger = createLogger({
    transports: process.env.NODE_ENV !== 'production' ? [consoleTransport] : [consoleTransport, fileTransport],
  });

  return logger;
}

module.exports = {
  getLogger,
};
