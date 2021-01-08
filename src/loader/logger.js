const winston = require("winston");
const config = require("../config");

const { combine, label, timestamp, printf, colorize, errors } = winston.format;

/**
 * creates a logger
 * @return {import("winston").Logger} winston logger object
 */
function createLogger() {
  const consoleTransport = new winston.transports.Console({
    level: config.logs.level || "debug",
    format: combine(
      timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      colorize(),
      label({ label: config.applicationName }),
      printf(({ timestamp, level, label, stack, message }) => {
        // print the stack if we have it, message otherwise.
        message = stack || message;
        return `${timestamp} [${label}] ${level}: ${message}`;
      })
    ),
  });

  return winston.createLogger({
    format: errors({ stack: true }),
    transports: [consoleTransport],
  });
}

const loggerInstance = createLogger();

module.exports = loggerInstance;
