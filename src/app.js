const express = require("express");

const loader = require("./loader");
const { logger } = loader;

logger.info(`Initiating the application setup`);

const app = express();

const { queues } = loader.loadBullMQ();
logger.info(`Completed BullMQ setup`);

loader.loadExpress(app, { bullQueues: queues });
logger.info(`Completed Express setup`);

logger.info(`Completed the application setup`);

module.exports = app;
