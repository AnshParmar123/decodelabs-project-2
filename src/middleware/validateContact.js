const ApiError = require('../utils/ApiError');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * The Gatekeeper Rule: never trust the client. Every field is checked for
 * both syntactic shape (right type, right format) and basic semantic sense
 * (non-empty, within reasonable length) before it ever reaches the store.
 */
function validateContactBody(req, res, next) {
  const { name, email, message } = req.body || {};
  const errors = [];

  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
    errors.push('name must be a string between 2 and 100 characters');
  }

  if (typeof email !== 'string' || !EMAIL_PATTERN.test(email.trim())) {
    errors.push('email must be a valid email address');
  }

  if (typeof message !== 'string' || message.trim().length < 10 || message.trim().length > 2000) {
    errors.push('message must be a string between 10 and 2000 characters');
  }

  if (errors.length) {
    return next(ApiError.badRequest('Validation failed', errors));
  }

  req.body = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    message: message.trim(),
  };
  next();
}

function validateStatusUpdate(req, res, next) {
  const { status } = req.body || {};
  const allowed = ['new', 'read'];

  if (status !== undefined && !allowed.includes(status)) {
    return next(ApiError.badRequest(`status must be one of: ${allowed.join(', ')}`));
  }

  next();
}

module.exports = { validateContactBody, validateStatusUpdate };
