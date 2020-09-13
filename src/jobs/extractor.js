const { Readability } = require('@mozilla/readability');
const JSDOM = require('jsdom').JSDOM;
const axios = require('axios').default;

const Logger = require('../loaders/logger');

module.exports = async function (job) {
  try {
    const { url } = job.data;

    if (!url) {
      throw new Error(`Empty URL was given. Please provide a url.`);
    }

    Logger.info(`Start extractor job #${job.id} with the url: ${url}`);

    const { data } = await axios.get(url);
    const dom = new JSDOM(data, {
      url,
      resources: 'usable',
    });

    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    Logger.info(`Finished extractor job #${job.id}`);
    return Promise.resolve(JSON.stringify(article));
  } catch (error) {
    Logger.error(error);
    return error;
  }
};
