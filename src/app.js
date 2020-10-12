const express = require('express');

const { getLogger } = require('./loaders/logger');
const config = require('./config');

const logger = getLogger('app');

async function startServer() {
  const app = express();

  await require('./loaders')(app);

  app.listen(config.port, (err) => {
    if (err) {
      logger.error(err);
      process.exit(1);
    }
    logger.info(`Server listening on port: ${config.port}`);
  });
}

startServer();
