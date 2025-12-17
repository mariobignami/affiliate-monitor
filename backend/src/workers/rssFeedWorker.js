const { rssQueue } = require('./queue');
const { Source, Offer, User } = require('../models');
const { fetchRssFeed, extractPrice, extractDiscount } = require('../services/scrapingService');
const { detectPlatform, generateUrlHash } = require('../services/affiliateService');
const logger = require('../utils/logger');

/**
 * Process RSS feed worker
 */
rssQueue.process(async (job) => {
  const { sourceId } = job.data;

  try {
    logger.info(`Processing RSS feed for source ${sourceId}`);

    // Get source
    const source = await Source.findByPk(sourceId, {
      include: ['user'],
    });

    if (!source || !source.active) {
      logger.warn(`Source ${sourceId} not found or inactive`);
      return { processed: 0, skipped: 1 };
    }

    // Fetch RSS feed
    const items = await fetchRssFeed(source.url);

    let processed = 0;
    let skipped = 0;

    for (const item of items) {
      try {
        // Generate hash to check for duplicates
        const hash = generateUrlHash(item.url);

        // Check if offer already exists
        const existingOffer = await Offer.findOne({ where: { hash } });
        if (existingOffer) {
          skipped++;
          continue;
        }

        // Detect platform
        const platform = detectPlatform(item.url);

        // Extract price and discount from description
        const combinedText = `${item.title} ${item.description}`;
        const price = extractPrice(combinedText);
        const discount = extractDiscount(combinedText);

        // Create offer
        await Offer.create({
          sourceId: source.id,
          userId: source.userId,
          title: item.title,
          description: item.description,
          originalUrl: item.url,
          imageUrl: item.imageUrl,
          price,
          discount,
          platform,
          hash,
          metadata: item.metadata,
          status: 'pending',
        });

        processed++;
      } catch (error) {
        logger.error(`Error processing RSS item: ${item.title}`, error);
        skipped++;
      }
    }

    // Update source
    await source.update({
      lastFetchedAt: new Date(),
      fetchCount: source.fetchCount + 1,
      errorCount: 0,
      lastError: null,
    });

    logger.info(`RSS feed processed for source ${sourceId}: ${processed} new, ${skipped} skipped`);

    return { processed, skipped };
  } catch (error) {
    logger.error(`Error processing RSS feed for source ${sourceId}:`, error);

    // Update source error
    const source = await Source.findByPk(sourceId);
    if (source) {
      await source.update({
        errorCount: source.errorCount + 1,
        lastError: error.message,
      });
    }

    throw error;
  }
});

logger.info('RSS feed worker initialized');

module.exports = rssQueue;
