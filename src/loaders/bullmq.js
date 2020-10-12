const path = require('path');
const { Queue, Worker } = require('bullmq');
const { setQueues } = require('../../external_modules/bull-board/dist/index');

const { getLogger } = require('./logger');
const { bullmq } = require('../config');

const logger = getLogger('loaders.bullmq');

module.exports = () => {
  const config = {
    connection: bullmq.redis,
  };

  const extractorQueue = new Queue('extractor', config);
  const analyzerQueue = new Queue('analyzer', config);
  const dispatcherQueue = new Queue('dispatcher', config);

  const workerDir = path.resolve(__dirname, '../workers');
  const extractorWorker = new Worker('extractor', `${workerDir}/extractor.js`, config);
  const analyzerWorker = new Worker('analyzer', `${workerDir}/analyzer.js`, config);
  const dispatcherWorker = new Worker('dispatcher', `${workerDir}/dispatcher.js`, config);

  extractorWorker.on('completed', (job) => {
    try {
      logger.info(`Job #${job.id} has completed!`);
      console.dir(JSON.parse(job.returnvalue));
    } catch (error) {
      logger.error(error);
    }
  });

  extractorWorker.on('failed', (job, err) => {
    logger.info(`Job #${job.id} has failed with ${err.message}`);
  });

  extractorWorker.on('error', (err) => {
    console.dir(err);
    logger.error(err);
  });

  // set queues for bull-board UI
  setQueues([extractorQueue, analyzerQueue, dispatcherQueue]);

  return {
    queues: [extractorQueue, analyzerQueue, dispatcherQueue],
    workers: [extractorWorker, analyzerWorker, dispatcherWorker],
  };
};
