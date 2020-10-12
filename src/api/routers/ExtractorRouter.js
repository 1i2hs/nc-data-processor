const { Router } = require('express');

/**
 *
 * @param {import('bullmq').Queue} extractorQueue
 * @returns {import('express').Router}
 */
function create(extractorQueue) {
  const router = Router();
  const extractController = require('../controllers/ExtractorController')(extractorQueue);

  router.post('/jobs', extractController.postEnqueueJob);

  return router;
}

module.exports = create;
