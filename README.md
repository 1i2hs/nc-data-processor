# now-connected/data-processor

A data  server application which collects **url** or a **list of url** and pass those data to Data Processing Engine.

A server application that extracts main content from the web page, analyzes the content to discover additional metadata, and passes the final data to the indexing engine. This application uses three types of message queue to form a sequential 3-step pipeline that executes the tasks stated above. Those three message queues are:
- `extractor`: extracts main content from the webpage.
- `analyzer`: analyzes the content to discover additional metadata using elasticsearch NLP feature.
- `dispatcher`: passes the final data(the main content of the webpage and the additional metadata) to the indexing engine.

The order of the execution is `extractor` -> `analyzer` -> `dispatcher`

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Lint & Code format
```bash

# lint(ESLint)
$ npm run lint

# format(Prettier)
$ npm run format
```

## License

  Data-Processor is [MIT licensed](LICENSE).