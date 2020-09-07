const bullMQLoader = require('./bullmq');
const expressLoader = require('./express');
const Logger = require('./logger');

/**
 * configures all required middlewares for express application
 * @param {import('express').Application} app
 */
module.exports = async (app) => {
  const { queues, workers } = bullMQLoader();
  await expressLoader(app, queues);
  Logger.info('Express application loaded');
};
