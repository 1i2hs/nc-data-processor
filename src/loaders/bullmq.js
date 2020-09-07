const path = require('path');
const { Queue, Worker } = require('bullmq');
const Logger = require('./logger');
const { bullmq } = require('../config');

module.exports = () => {
  const config = {
    connection: bullmq.redis,
  };

  const extractorQueue = new Queue('extractor', config);
  const analyzerQueue = new Queue('analyzer', config);
  const dispatcherQueue = new Queue('dispatcher', config);

  const jobDir = path.resolve(__dirname, '../jobs');
  const extractorWorker = new Worker('extractor', `${jobDir}/extractor.js`, config);
  const analyzerWorker = new Worker('analyzer', `${jobDir}/analyzer.js`, config);
  const dispatcherWorker = new Worker('dispatcher', `${jobDir}/dispatcher.js`, config);

  extractorWorker.on('completed', (job) => {
    Logger.info(`${job.id} has completed!`);
  });

  extractorWorker.on('failed', (job, err) => {
    Logger.info(`${job.id} has failed with ${err.message}`);
  });

  return {
    queues: [extractorQueue, analyzerQueue, dispatcherQueue],
    workers: [extractorWorker, analyzerWorker, dispatcherWorker],
  };
};
