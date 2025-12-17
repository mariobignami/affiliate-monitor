const Joi = require('joi');

/**
 * Validate data against a Joi schema
 * @param {Object} data - Data to validate
 * @param {Object} schema - Joi schema
 * @returns {Object} - Validation result
 */
const validate = (data, schema) => {
  return schema.validate(data, { abortEarly: false });
};

/**
 * User validation schemas
 */
const userSchemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(2).max(100).required(),
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

/**
 * Source validation schemas
 */
const sourceSchemas = {
  create: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    type: Joi.string().valid('rss', 'scraper', 'api').required(),
    url: Joi.string().uri().required(),
    active: Joi.boolean().default(true),
    config: Joi.object().default({}),
  }),
  update: Joi.object({
    name: Joi.string().min(2).max(100),
    type: Joi.string().valid('rss', 'scraper', 'api'),
    url: Joi.string().uri(),
    active: Joi.boolean(),
    config: Joi.object(),
  }),
};

/**
 * Channel validation schemas
 */
const channelSchemas = {
  create: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    type: Joi.string().valid('telegram', 'whatsapp', 'discord').required(),
    config: Joi.object().required(),
    active: Joi.boolean().default(true),
  }),
  update: Joi.object({
    name: Joi.string().min(2).max(100),
    type: Joi.string().valid('telegram', 'whatsapp', 'discord'),
    config: Joi.object(),
    active: Joi.boolean(),
  }),
};

/**
 * Rule validation schemas
 */
const ruleSchemas = {
  create: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    sourceId: Joi.number().integer().required(),
    channelId: Joi.number().integer().required(),
    filters: Joi.object().default({}),
    active: Joi.boolean().default(true),
  }),
  update: Joi.object({
    name: Joi.string().min(2).max(100),
    sourceId: Joi.number().integer(),
    channelId: Joi.number().integer(),
    filters: Joi.object(),
    active: Joi.boolean(),
  }),
};

module.exports = {
  validate,
  userSchemas,
  sourceSchemas,
  channelSchemas,
  ruleSchemas,
};
