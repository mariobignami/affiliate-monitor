const { linkConversionQueue } = require('./queue');
const { Offer, User } = require('../models');
const { convertAffiliateLink } = require('../services/affiliateService');
const logger = require('../utils/logger');

/**
 * Process link conversion worker
 */
linkConversionQueue.process(async (job) => {
  const { offerId } = job.data;

  try {
    logger.info(`Converting affiliate link for offer ${offerId}`);

    // Get offer with user
    const offer = await Offer.findByPk(offerId, {
      include: ['user'],
    });

    if (!offer) {
      logger.warn(`Offer ${offerId} not found`);
      return { converted: false };
    }

    if (offer.status !== 'pending') {
      logger.warn(`Offer ${offerId} already processed`);
      return { converted: false };
    }

    // Get user's affiliate IDs
    const affiliateIds = offer.user.affiliateIds || {};

    // Convert link
    const affiliateUrl = convertAffiliateLink(offer.originalUrl, affiliateIds);

    // Update offer
    await offer.update({
      affiliateUrl,
      status: 'processing',
    });

    logger.info(`Link converted for offer ${offerId}`);

    return { converted: true };
  } catch (error) {
    logger.error(`Error converting link for offer ${offerId}:`, error);
    throw error;
  }
});

logger.info('Link conversion worker initialized');

module.exports = linkConversionQueue;
