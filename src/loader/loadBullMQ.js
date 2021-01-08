const path = require("path");
const { Queue, Worker } = require("bullmq");
const { setQueues } = require("../../external_modules/bull-board/dist/index");

const logger = require("./logger");
const { bullmq } = require("../config");

function loadBullMQ() {
  const config = {
    connection: bullmq.redis,
  };

  const extractorQueue = new Queue("extractor", config);
  const analyzerQueue = new Queue("analyzer", config);
  const archiverQueue = new Queue("archiver", config);
  const dispatcherQueue = new Queue("dispatcher", config);

  const workerDir = path.resolve(__dirname, "../workers");
  const extractorWorker = new Worker(
    "extractor",
    `${workerDir}/extractor.js`,
    config
  );
  const analyzerWorker = new Worker(
    "analyzer",
    `${workerDir}/analyzer.js`,
    config
  );
  const archiverWorker = new Worker(
    "archiver",
    `${workerDir}/archiver.js`,
    config
  );
  const dispatcherWorker = new Worker(
    "dispatcher",
    `${workerDir}/dispatcher.js`,
    config
  );

  // extractor worker's event listeners
  extractorWorker.on("completed", (job) => {
    try {
      logger.info(`Extractor job #${job.id} has completed!`);
      archiverQueue.add("archiver", { article: JSON.parse(job.returnvalue) });
    } catch (error) {
      logger.error(error);
    }
  });

  extractorWorker.on("failed", (job, err) => {
    logger.info(`Extractor job #${job.id} has failed with ${err.message}`);
  });

  extractorWorker.on("error", (err) => {
    logger.error(err);
  });

  // archiver worker's event listeners
  archiverWorker.on("completed", (job) => {
    try {
      logger.info(`archiver job #${job.id} has completed!`);
      dispatcherQueue.add("dispatcher", {
        article: JSON.parse(job.returnvalue),
      });
    } catch (error) {
      logger.error(error);
    }
  });

  archiverWorker.on("failed", (job, err) => {
    logger.info(`archiver job #${job.id} has failed with ${err.message}`);
  });

  archiverWorker.on("error", (err) => {
    logger.error(err);
  });

  // dispatcher worker's event listeners
  dispatcherWorker.on("completed", (job) => {
    try {
      logger.info(`Dispatcher job #${job.id} has completed!`);
    } catch (error) {
      logger.error(error);
    }
  });

  dispatcherWorker.on("failed", (job, err) => {
    logger.info(`Dispatcher job #${job.id} has failed with ${err.message}`);
  });

  dispatcherWorker.on("error", (err) => {
    logger.error(err);
  });

  // set queues for bull-board UI
  setQueues([extractorQueue, analyzerQueue, archiverWorker, dispatcherQueue]);

  return {
    queues: [extractorQueue, analyzerQueue, archiverQueue, dispatcherQueue],
    workers: [
      extractorWorker,
      analyzerWorker,
      archiverWorker,
      dispatcherWorker,
    ],
  };
}

module.exports = loadBullMQ;
