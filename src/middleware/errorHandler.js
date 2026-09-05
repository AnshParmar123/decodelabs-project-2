const ApiError = require('../utils/ApiError');

function notFoundHandler(req, res, next) {
  next(ApiError.notFound(`Cannot ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // express.json() throws a raw SyntaxError on malformed request bodies —
  // that's a client mistake (400), not a server fault (500).
  if (err.type === 'entity.parse.failed' || err instanceof SyntaxError) {
    err = ApiError.badRequest('Malformed JSON in request body');
  }

  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = statusCode === 500 ? 'Internal server error' : err.message;

  if (statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    error: {
      status: statusCode,
      message,
      ...(err.details ? { details: err.details } : {}),
    },
  });
}

module.exports = { notFoundHandler, errorHandler };
