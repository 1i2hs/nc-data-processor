const { Router } = require('express');
const Logger = require('../../loaders/logger');

const route = Router();

/**
 *
 * @param {import('express').Router} app
 * @param {import('bullmq').Queue} extractorQueue
 */
module.exports = (app, extractorQueue) => {
  route.post('/jobs', async (req, res) => {
    const { body } = req;
    const { url } = body;

    // await extractorQueue.add('extractor', { url }, { removeOnComplete: true, removeOnFail: true, attempts: 1 });
    await extractorQueue.add('extractor', { url });

    res.send({ message: 'Successfully queued the job' });
  });

  app.use('/extractor', route);
};
