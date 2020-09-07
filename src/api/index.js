const { Router } = require('express');
const extractor = require('./routers/extractor');

// guaranteed to get dependencies
module.exports = (dependencies = { queues: [] }) => {
  const app = Router();

  const { queues } = dependencies;
  const [extractorQueue, analyzerQueue, dispatcherQueue] = queues;

  // initialize app with custom middlewares and routers here
  extractor(app, extractorQueue);

  return app;
};
