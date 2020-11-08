const { Router } = require('express');
const ExtractorRouter = require('./routers/ExtractorRouter');

// guaranteed to get dependencies
module.exports = (dependencies = { queues: [] }) => {
  const app = Router();

  const { queues } = dependencies;
  const [extractorQueue] = queues;

  // initialize app with custom middlewares and routers here
  app.use('/extractor', ExtractorRouter(extractorQueue));

  return app;
};
