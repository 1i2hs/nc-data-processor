const { getLogger } = require('../../loaders/logger');
const logger = getLogger('api.controllers.ExtractorController');
/**
 *
 * @param {import('bullmq').Queue} extractorQueue
 * @returns {{ postEnqueueJob: (req, res) => Promise.<void> }}
 */
function create(extractorQueue) {
  async function postEnqueueJob(req, res) {
    const { body } = req;
    const { url } = body;

    logger.info(`enqueued url: ${url}`);
    // await extractorQueue.add('extractor', { url }, { removeOnComplete: true, removeOnFail: true, attempts: 1 });
    await extractorQueue.add('extractor', { url });

    res.send({ message: 'Successfully queued the job' });
  }

  return {
    postEnqueueJob,
  };
}

module.exports = create;
