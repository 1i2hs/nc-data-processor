const { Readability } = require("@mozilla/readability");
const JSDOM = require("jsdom").JSDOM;
const axios = require("axios").default;

const { logger } = require("../loader");

module.exports = async function (job) {
  try {
    const { url } = job.data;

    if (!url) {
      throw new Error(`Empty URL was given. Please provide a url.`);
    }

    logger.info(`Start extractor job #${job.id} with the url: ${url}`);

    const { data } = await axios.get(url);
    const dom = new JSDOM(data, {
      url,
      resources: "usable",
    });

    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    const { content, textContent } = article;
    if (
      content === null ||
      content === undefined ||
      textContent === null ||
      textContent === undefined
    ) {
      throw new Error(
        `The given URL '${url}' has an empty content. Please check whether it is valid or not.`
      );
    }

    const result = Object.assign(Object.create(null), article, { url });

    logger.info(`Finished extractor job #${job.id}`);
    return JSON.stringify(result);
  } catch (error) {
    logger.error(error);
    return error;
  }
};
