const { Router } = require('express');
const route = Router();

/**
 *
 * @param {import('express').Router} app
 * @param {import('bullmq').Queue} extractorQueue
 */
module.exports = (app, extractorQueue) => {
  route.post('/jobs', (req, res) => {
    const { body } = req;

    extractorQueue.add('extractor', { message: 'hello' });
    res.send({ message: 'Successfully queued the job' });
  });

  app.use('/extractor', route);
};
