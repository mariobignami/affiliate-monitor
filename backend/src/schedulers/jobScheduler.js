const cron = require('node-cron');
const { Source, Offer } = require('../models');
const { rssQueue, linkConversionQueue, messageDispatchQueue } = require('../workers/queue');
const logger = require('../utils/logger');

/**
 * Schedule RSS feed fetching
 */
const scheduleRssFeedFetching = () => {
  // Run every 10 minutes
  cron.schedule('*/10 * * * *', async () => {
    try {
      logger.info('Running RSS feed fetching job');

      // Get all active RSS sources
      const sources = await Source.findAll({
        where: {
          type: 'rss',
          active: true,
        },
      });

      logger.info(`Found ${sources.length} active RSS sources`);

      // Add jobs to queue
      for (const source of sources) {
        await rssQueue.add(
          { sourceId: source.id },
          {
            attempts: 3,
            backoff: {
              type: 'exponential',
              delay: 2000,
            },
          }
        );
      }
    } catch (error) {
      logger.error('Error in RSS feed fetching job:', error);
    }
  });

  logger.info('RSS feed fetching scheduled (every 10 minutes)');
};

/**
 * Schedule link conversion
 */
const scheduleLinkConversion = () => {
  // Run every 2 minutes
  cron.schedule('*/2 * * * *', async () => {
    try {
      logger.info('Running link conversion job');

      // Get pending offers
      const offers = await Offer.findAll({
        where: { status: 'pending' },
        limit: 50,
        order: [['createdAt', 'ASC']],
      });

      logger.info(`Found ${offers.length} pending offers for conversion`);

      // Add jobs to queue
      for (const offer of offers) {
        await linkConversionQueue.add(
          { offerId: offer.id },
          {
            attempts: 3,
            backoff: {
              type: 'exponential',
              delay: 1000,
            },
          }
        );
      }
    } catch (error) {
      logger.error('Error in link conversion job:', error);
    }
  });

  logger.info('Link conversion scheduled (every 2 minutes)');
};

/**
 * Schedule message dispatching
 */
const scheduleMessageDispatching = () => {
  // Run every minute
  cron.schedule('* * * * *', async () => {
    try {
      logger.info('Running message dispatching job');

      // Get offers ready for dispatch
      const offers = await Offer.findAll({
        where: { status: 'processing' },
        limit: 20,
        order: [['createdAt', 'ASC']],
      });

      logger.info(`Found ${offers.length} offers ready for dispatch`);

      // Add jobs to queue with delay to avoid rate limiting
      for (let i = 0; i < offers.length; i++) {
        await messageDispatchQueue.add(
          { offerId: offers[i].id },
          {
            attempts: 3,
            backoff: {
              type: 'exponential',
              delay: 2000,
            },
            delay: i * 2000, // Stagger messages by 2 seconds
          }
        );
      }
    } catch (error) {
      logger.error('Error in message dispatching job:', error);
    }
  });

  logger.info('Message dispatching scheduled (every minute)');
};

/**
 * Initialize all schedulers
 */
const initializeSchedulers = () => {
  scheduleRssFeedFetching();
  scheduleLinkConversion();
  scheduleMessageDispatching();
  logger.info('All schedulers initialized');
};

module.exports = {
  initializeSchedulers,
};
