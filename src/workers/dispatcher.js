const axios = require('axios').default;

const { getLogger } = require('../loaders/logger');
const { elasticsearch } = require('../config');
const { validateArticle } = require('../libs/workerUtil');

const logger = getLogger('worker.dispatcher');

const ELASTICSEARCH_URL = `http://${elasticsearch.host}:${elasticsearch.port}`;

module.exports = async (job) => {
  try {
    const { article } = job.data;
    const { index } = article;

    validateArticle(article);

    logger.info(`Start dispatcher job #${job.id}`);

    // TODO: dispatch pdf file first

    const response = await axios.post(
      `${ELASTICSEARCH_URL}/${index === null || index === undefined ? elasticsearch.defaultIndex : index}/_doc`,
      article,
    );

    if (response.status >= 200 && response.status < 400) {
      logger.info(`Finished extractor job #${job.id}`);
      return;
    }

    throw new Error(
      `The dispatching task ended with the status code ${response.status} and the status text '${response.statusText}. Please investigate the root cause'. `,
    );
  } catch (error) {
    logger.error(error);
    return error;
  }
};
