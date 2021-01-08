const { Router } = require("express");

const extractController = require("../controllers/extractorController");

/**
 * crates router for extractor APIs
 * @param {import('bullmq').Queue} extractorQueue
 * @returns {import('express').Router}
 */
function create(extractorQueue) {
  const router = Router();
  const controller = extractController(extractorQueue);

  router.post("/jobs", controller.postEnqueueJob);

  return router;
}

module.exports = create;
