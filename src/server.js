'use strict';

// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
// Esoteric Resources
const logger = require('./auth/middleware/logger.js');
const v1Routes = require('../src/auth/v2.js');
const errorHandler = require('./error-handlers/500.js');
const notFound = require('./error-handlers/404.js');
const authRoutes = require('./auth/routes.js');

// Prepare the express app
const app = express();

// App Level MW
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Routes
app.use(authRoutes);
app.use('/api/v2', v1Routes);
app.get('/', (_req, res) => {
  res.status(200).send("Proof Of Life")
});

// Catchalls
app.use('*',notFound);
app.use(errorHandler);

module.exports = {
  app,
  start: (port) => {
    app.listen(port, () => {
      console.log(`Server Up on ${port}`);
    });
  },
};
