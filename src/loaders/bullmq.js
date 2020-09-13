const path = require('path');
const { Queue, Worker } = require('bullmq');
const { setQueues } = require('../libs/bull-board/dist/index');

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
    try {
      Logger.info(`Job #${job.id} has completed!`);
      console.dir(JSON.parse(job.returnvalue));
    } catch (error) {
      Logger.error(error);
    }
  });

  extractorWorker.on('failed', (job, err) => {
    Logger.info(`Job #${job.id} has failed with ${err.message}`);
  });

  extractorWorker.on('error', (err) => {
    console.dir(err);
    Logger.error(err);
  });

  // set queues for bull-board UI
  setQueues([extractorQueue, analyzerQueue, dispatcherQueue]);

  return {
    queues: [extractorQueue, analyzerQueue, dispatcherQueue],
    workers: [extractorWorker, analyzerWorker, dispatcherWorker],
  };
};
