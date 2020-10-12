const bullMQLoader = require('./bullmq');
const expressLoader = require('./express');
const { getLogger } = require('./logger');
const logger = getLogger('loaders');

/**
 * configures all required middlewares for express application
 * @param {import('express').Application} app
 */
module.exports = async (app) => {
  const { queues } = bullMQLoader();
  await expressLoader(app, queues);
  logger.info('Express application loaded');
};
