const logger = require('../utils/logger');
const {
  ValidationError,
  NotFoundError,
  ForbiddenError,
  ConflictError,
} = require('../utils/errors');

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = 500;
  let code = 'INTERNAL_ERROR';
  let message = 'Internal server error';
  let details;

  if (err instanceof ValidationError) {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = err.message;
    details = err.details;
  } else if (err.isJoi) {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = 'Validation failed';
    details = err.details.map((d) => d.message);
  } else if (err instanceof NotFoundError) {
    statusCode = 404;
    code = 'NOT_FOUND';
    message = err.message;
    details = err.details;
  } else if (err instanceof ForbiddenError) {
    statusCode = 403;
    code = 'FORBIDDEN';
    message = err.message;
    details = err.details;
  } else if (err instanceof ConflictError) {
    statusCode = 409;
    code = 'CONFLICT';
    message = err.message;
    details = err.details;
  } else if (err.statusCode && Number.isInteger(err.statusCode)) {
    statusCode = err.statusCode;
    code = err.code || 'ERROR';
    message = err.message || message;
    details = err.details;
  }

  if (statusCode >= 500) {
    logger.error('Server error', {
      err: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });
  } else if (process.env.NODE_ENV === 'development') {
    logger.error('Request error', {
      err: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });
  }

  res.status(statusCode).json({
    error: {
      message,
      code,
      details: details !== undefined ? details : null,
    },
  });
}

module.exports = errorHandler;
