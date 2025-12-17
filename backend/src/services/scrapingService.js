const Parser = require('rss-parser');
const axios = require('axios');
const logger = require('../utils/logger');

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': process.env.SCRAPER_USER_AGENT || 'Mozilla/5.0',
  },
});

/**
 * Fetch RSS feed
 */
const fetchRssFeed = async (url) => {
  try {
    logger.info(`Fetching RSS feed: ${url}`);
    const feed = await parser.parseURL(url);

    const items = feed.items.map(item => ({
      title: item.title || '',
      description: item.contentSnippet || item.content || '',
      url: item.link || '',
      imageUrl: item.enclosure?.url || item.image?.url || '',
      publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
      metadata: {
        author: item.creator || item.author || '',
        categories: item.categories || [],
        guid: item.guid || '',
      },
    }));

    logger.info(`Fetched ${items.length} items from RSS feed: ${url}`);

    return items;
  } catch (error) {
    logger.error(`Error fetching RSS feed ${url}:`, error);
    throw error;
  }
};

/**
 * Fetch multiple RSS feeds
 */
const fetchMultipleFeeds = async (urls) => {
  try {
    const promises = urls.map(url => fetchRssFeed(url));
    const results = await Promise.allSettled(promises);

    const items = [];
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        items.push(...result.value);
      } else {
        logger.error(`Failed to fetch feed ${urls[index]}:`, result.reason);
      }
    });

    return items;
  } catch (error) {
    logger.error('Error fetching multiple feeds:', error);
    throw error;
  }
};

/**
 * Extract price from text
 */
const extractPrice = (text) => {
  if (!text) return null;

  // Try to find price patterns
  const patterns = [
    /R\$\s*(\d+(?:[.,]\d{2})?)/i,
    /(\d+(?:[.,]\d{2})?)\s*reais/i,
    /por\s*R?\$?\s*(\d+(?:[.,]\d{2})?)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const price = parseFloat(match[1].replace(',', '.'));
      return price;
    }
  }

  return null;
};

/**
 * Extract discount from text
 */
const extractDiscount = (text) => {
  if (!text) return null;

  const patterns = [
    /(\d+)%\s*off/i,
    /(\d+)%\s*desconto/i,
    /desconto\s*de\s*(\d+)%/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return parseInt(match[1]);
    }
  }

  return null;
};

module.exports = {
  fetchRssFeed,
  fetchMultipleFeeds,
  extractPrice,
  extractDiscount,
};
