const winston = require('winston');
const { createLogger, transports, format } = winston;
const config = require('../config');

const { combine, label, timestamp, printf, colorize, json, errors } = format;

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
      printf(({ timestamp, level, label, stack, message }) => {
        // print the stack if we have it, message otherwise.
        message = stack || message;
        return `${timestamp} [${label}] ${level}: ${message}`;
      }),
    ),
  });

  if (process.env.NODE_ENV === 'production') {
    require('winston-daily-rotate-file');

    const fileTransport = new winston.transports.DailyRotateFile({
      filename: '%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '7d',
      level: 'info',
      handleExceptions: true,
      format: combine(
        timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        label({ label: name }),
        json()
      ),
    });

    return createLogger({
      format: errors({ stack: true }),
      transports: [consoleTransport, fileTransport],
    });
  }

  const logger = createLogger({
    format: errors({ stack: true }),
    transports: [consoleTransport],
  });

  return logger;
}

module.exports = {
  getLogger,
};
