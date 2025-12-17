const Queue = require('bull');
const logger = require('../utils/logger');

const REDIS_CONFIG = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
};

// Create queues
const rssQueue = new Queue('rss-feed', { redis: REDIS_CONFIG });
const linkConversionQueue = new Queue('link-conversion', { redis: REDIS_CONFIG });
const messageDispatchQueue = new Queue('message-dispatch', { redis: REDIS_CONFIG });

// Configure queue event handlers
const setupQueueHandlers = (queue, name) => {
  queue.on('error', (error) => {
    logger.error(`Queue ${name} error:`, error);
  });

  queue.on('failed', (job, error) => {
    logger.error(`Job ${job.id} in queue ${name} failed:`, error);
  });

  queue.on('completed', (job) => {
    logger.info(`Job ${job.id} in queue ${name} completed`);
  });
};

setupQueueHandlers(rssQueue, 'rss-feed');
setupQueueHandlers(linkConversionQueue, 'link-conversion');
setupQueueHandlers(messageDispatchQueue, 'message-dispatch');

module.exports = {
  rssQueue,
  linkConversionQueue,
  messageDispatchQueue,
};
