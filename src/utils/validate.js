const Joi = require('joi');
const { ValidationError } = require('./errors');

function validateBody(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      const details = error.details.map(d => d.message);
      throw new ValidationError(details.join('; '));
    }
    req.body = value;  // use sanitized value
    next();
  };
}

module.exports = { validateBody };
