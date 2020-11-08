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
  const archieverQueue = new Queue('archiever', config);
  const dispatcherQueue = new Queue('dispatcher', config);

  const workerDir = path.resolve(__dirname, '../workers');
  const extractorWorker = new Worker('extractor', `${workerDir}/extractor.js`, config);
  const analyzerWorker = new Worker('analyzer', `${workerDir}/analyzer.js`, config);
  const archieverWorker = new Worker('archiever', `${workerDir}/archiever.js`, config);
  const dispatcherWorker = new Worker('dispatcher', `${workerDir}/dispatcher.js`, config);

  // extractor worker's event listeners
  extractorWorker.on('completed', (job) => {
    try {
      logger.info(`Extractor job #${job.id} has completed!`);
      archieverQueue.add('archiever', { article: JSON.parse(job.returnvalue) });
    } catch (error) {
      logger.error(error);
    }
  });

  extractorWorker.on('failed', (job, err) => {
    logger.info(`Extractor job #${job.id} has failed with ${err.message}`);
  });

  extractorWorker.on('error', (err) => {
    logger.error(err);
  });

  // archiever worker's event listeners
  archieverWorker.on('completed', (job) => {
    try {
      logger.info(`Archiever job #${job.id} has completed!`);
      dispatcherQueue.add('dispatcher', { article: JSON.parse(job.returnvalue) });
    } catch (error) {
      logger.error(error);
    }
  });

  archieverWorker.on('failed', (job, err) => {
    logger.info(`Archiever job #${job.id} has failed with ${err.message}`);
  });

  archieverWorker.on('error', (err) => {
    logger.error(err);
  });

  // dispatcher worker's event listeners
  dispatcherWorker.on('completed', (job) => {
    try {
      logger.info(`Dispatcher job #${job.id} has completed!`);
    } catch (error) {
      logger.error(error);
    }
  });

  dispatcherWorker.on('failed', (job, err) => {
    logger.info(`Dispatcher job #${job.id} has failed with ${err.message}`);
  });

  dispatcherWorker.on('error', (err) => {
    logger.error(err);
  });

  // set queues for bull-board UI
  setQueues([extractorQueue, analyzerQueue, archieverWorker, dispatcherQueue]);

  return {
    queues: [extractorQueue, analyzerQueue, archieverQueue, dispatcherQueue],
    workers: [extractorWorker, analyzerWorker, archieverWorker, dispatcherWorker],
  };
};
