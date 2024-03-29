const timber = require('timber');
const bunyan = require('bunyan');
const express = require('express');

// Initialize our express app
const app = express();

// Setup the default port to listen on
const port = process.env.PORT || 8080;

// Initialize our timber transport stream
const transport = new timber.transports.HTTPS('Your-Timber-API-Key');
timber.install(transport)

// Create our bunyan logger and attach our stream
const log = bunyan.createLogger({
  name: 'Timber Logger',
  stream: new timber.transports.Bunyan()
});

// Add the express middleware to log HTTP events
// And enable logging of the request/response body (defaults to false)
app.use(timber.middlewares.express({ capture_request_body: true }));


// Configure timber...
// The timber logger must be set so that the express middleware
// uses the correct logger. The middleware logs to console by default
timber.config.logger = log;


// Create the index route
app.get('/', (req, res) => {
  res.send('Welcome to the index route :)');
});

// If you post json data to this route it will be logged in Timber
app.post('/post', (req, res) => {
  res.json({
    description: 'Check your timber console',
    date: new Date(),
    body: req.body
  });
});

// This route throws an exception upon load,
// demonstrating how exceptions appear on timber.
app.get('/exception', (req, res) => {
  throw new Error('This is an exception');
});

// Start our express server
app.listen(port, () => {
  log.info(`Server started on port ${port}`);
});
