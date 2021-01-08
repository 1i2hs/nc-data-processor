function validateArticle(article) {
  const error = new Error(
    `The given article has an empty content. Please check whether it is valid or not.`
  );
  if (article === null || article === undefined) {
    throw error;
  }
  const { content, textContent } = article;
  if (
    content === null ||
    content === undefined ||
    textContent === null ||
    textContent === undefined
  ) {
    throw error;
  }
}

module.exports = {
  validateArticle,
};
