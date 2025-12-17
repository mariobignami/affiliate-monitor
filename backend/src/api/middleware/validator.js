const { validate } = require('../../utils/validators');

/**
 * Middleware factory for request validation
 * @param {Object} schema - Joi validation schema
 * @param {string} property - Request property to validate (body, params, query)
 */
const validateRequest = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = validate(req[property], schema);

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
      });
    }

    // Replace request property with validated value
    req[property] = value;
    next();
  };
};

module.exports = validateRequest;
