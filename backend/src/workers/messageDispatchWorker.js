const { messageDispatchQueue } = require('./queue');
const { Offer, Rule, Channel } = require('../models');
const { sendOfferToTelegram } = require('../integrations/telegram');
const logger = require('../utils/logger');

/**
 * Check if offer matches rule filters
 */
const matchesFilters = (offer, filters) => {
  if (!filters || Object.keys(filters).length === 0) {
    return true;
  }

  // Check keywords
  if (filters.keywords && filters.keywords.length > 0) {
    const searchText = `${offer.title} ${offer.description}`.toLowerCase();
    const hasKeyword = filters.keywords.some(keyword =>
      searchText.includes(keyword.toLowerCase())
    );
    if (!hasKeyword) return false;
  }

  // Check price range
  if (filters.minPrice && offer.price && offer.price < filters.minPrice) {
    return false;
  }
  if (filters.maxPrice && offer.price && offer.price > filters.maxPrice) {
    return false;
  }

  // Check minimum discount
  if (filters.minDiscount && (!offer.discount || offer.discount < filters.minDiscount)) {
    return false;
  }

  // Check platform
  if (filters.platforms && filters.platforms.length > 0) {
    if (!filters.platforms.includes(offer.platform)) {
      return false;
    }
  }

  return true;
};

/**
 * Process message dispatch worker
 */
messageDispatchQueue.process(async (job) => {
  const { offerId } = job.data;

  try {
    logger.info(`Dispatching message for offer ${offerId}`);

    // Get offer
    const offer = await Offer.findByPk(offerId, {
      include: ['source'],
    });

    if (!offer) {
      logger.warn(`Offer ${offerId} not found`);
      return { sent: 0 };
    }

    if (offer.status !== 'processing') {
      logger.warn(`Offer ${offerId} not ready for dispatch`);
      return { sent: 0 };
    }

    // Get matching rules
    const rules = await Rule.findAll({
      where: {
        sourceId: offer.sourceId,
        active: true,
      },
      include: ['channel'],
      order: [['priority', 'DESC']],
    });

    let sentCount = 0;
    const sentToChannels = [];
    const errors = [];

    for (const rule of rules) {
      try {
        // Check if offer matches rule filters
        if (!matchesFilters(offer, rule.filters)) {
          logger.debug(`Offer ${offerId} doesn't match rule ${rule.id}`);
          continue;
        }

        // Check if channel is active
        if (!rule.channel || !rule.channel.active) {
          logger.warn(`Channel for rule ${rule.id} is inactive`);
          continue;
        }

        // Send message based on channel type
        let sent = false;

        if (rule.channel.type === 'telegram') {
          await sendOfferToTelegram(offer, rule.channel.config);
          sent = true;
        }
        // Add support for other channel types (WhatsApp, Discord) here

        if (sent) {
          sentCount++;
          sentToChannels.push(rule.channelId);

          // Update rule stats
          await rule.update({
            matchCount: rule.matchCount + 1,
            lastMatchedAt: new Date(),
          });

          // Update channel stats
          await rule.channel.update({
            messageCount: rule.channel.messageCount + 1,
            lastMessageAt: new Date(),
            errorCount: 0,
            lastError: null,
          });
        }
      } catch (error) {
        logger.error(`Error sending to channel ${rule.channelId}:`, error);
        errors.push({
          channelId: rule.channelId,
          error: error.message,
        });

        // Update channel error
        await rule.channel.update({
          errorCount: rule.channel.errorCount + 1,
          lastError: error.message,
        });
      }
    }

    // Update offer status
    await offer.update({
      status: sentCount > 0 ? 'sent' : 'skipped',
      sentAt: sentCount > 0 ? new Date() : null,
      sentToChannels,
    });

    logger.info(`Message dispatched for offer ${offerId}: sent to ${sentCount} channels`);

    return { sent: sentCount, errors };
  } catch (error) {
    logger.error(`Error dispatching message for offer ${offerId}:`, error);

    // Update offer as failed
    const offer = await Offer.findByPk(offerId);
    if (offer) {
      await offer.update({ status: 'failed' });
    }

    throw error;
  }
});

logger.info('Message dispatch worker initialized');

module.exports = messageDispatchQueue;
