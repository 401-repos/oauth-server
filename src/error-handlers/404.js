'use strict';

module.exports = (_req, res, _next) => {
  let error = {
    status: 404,
    message: 'Sorry, we could not find what you were looking for',
    error: 'Resource Not Found',
  };
  res.statusCode = 404;
  res.statusMessage = 'Not Found';
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(error));
  res.end();
};