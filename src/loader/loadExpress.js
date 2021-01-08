const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const { router } = require("../../external_modules/bull-board/dist/index");

const { createAPIRouter } = require("../api");
const config = require("../config");

/**
 * configures all required middlewares for express application
 * @param {import('express').Application} app
 * @param {object} option
 * @param {Array.<import('bullmq').Queue>} option.bullQueues
 */
function loadExpress(app, option) {
  const { bullQueues } = option;

  /**
   * Health Check endpoints
   * @TODO Explain why they are here
   */
  app.get("/status", (req, res) => {
    res.status(200).end();
  });

  app.head("/status", (req, res) => {
    res.status(200).end();
  });

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable("trust proxy");

  // The magic package that prevents frontend developers going nuts
  // Alternate description:
  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors());

  // Some sauce that always add since 2014
  // "Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it."
  // Maybe not needed anymore ?
  app.use(require("method-override")());

  // Middleware that transforms the raw string of req.body into json
  app.use(bodyParser.json());

  // HTTP request logger middleware
  app.use(
    process.env.NODE_ENV === "production" ? morgan("common") : morgan("dev")
  );

  app.use("/admin/queues", router);

  // Load API routes
  app.use(config.api.prefix, createAPIRouter({ queues: bullQueues }));

  /// catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error("Not Found");
    err["status"] = 404;
    next(err);
  });

  /// error handlers
  app.use((err, req, res, next) => {
    /**
     * Handle 401 thrown by express-jwt library
     */
    if (err.name === "UnauthorizedError") {
      return res.status(err.status).send({ message: err.message }).end();
    }
    return next(err);
  });

  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
      },
    });
  });
}

module.exports = loadExpress;
