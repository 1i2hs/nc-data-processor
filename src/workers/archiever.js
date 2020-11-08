const fsp = require('fs').promises;
const puppeteer = require('puppeteer');

const { getLogger } = require('../loaders/logger');
const { elasticsearch } = require('../config');
const { validateArticle } = require('../libs/workerUtil');

const logger = getLogger('worker.archiever');

// PDF archieving process
module.exports = async (job) => {
  try {
    const { article } = job.data;
    const { url, index } = article;

    validateArticle(article);

    if (url === undefined || url == null) {
      throw new Error(`Empty URL was given. Please provide a url.`);
    }

    logger.info(`Start archiever job #${job.id}`);

    const fileName = Date.now();
    const folderName = index === null || index === undefined ? elasticsearch.defaultIndex : index;
    const dir = `./pdfs/${folderName}`;

    try {
      await fsp.access(dir);
    } catch (error) {
      logger.error(error);
      await fsp.mkdir(dir, { recursive: true });
    }

    const filePath = `${dir}/${fileName}.pdf`;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.pdf({
      path: filePath,
      format: 'A4',
    });
    await browser.close();

    const result = Object.assign(article, { archievedFilePath: filePath });

    logger.info(`Finished archiever job #${job.id}`);
    return JSON.stringify(result);
  } catch (error) {
    logger.error(error);
    return error;
  }
};
