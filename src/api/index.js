const { Router } = require("express");

const routers = require("./routers");

// guaranteed to get dependencies
function createAPIRouter(dependencies = { queues: [] }) {
  const app = Router();

  const { queues } = dependencies;
  const [extractorQueue] = queues;

  // initialize app with custom middlewares and routers here
  app.use("/extractor", routers.extractorRouter(extractorQueue));

  return app;
}

module.exports = {
  createAPIRouter,
};
