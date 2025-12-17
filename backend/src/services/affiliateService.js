const crypto = require('crypto');
const logger = require('../utils/logger');

/**
 * Detect platform from URL
 */
const detectPlatform = (url) => {
  const urlLower = url.toLowerCase();

  if (urlLower.includes('amazon.com') || urlLower.includes('amzn.')) {
    return 'amazon';
  }
  if (urlLower.includes('shopee.com')) {
    return 'shopee';
  }
  if (urlLower.includes('mercadolivre.com') || urlLower.includes('mercadolibre.com')) {
    return 'mercadolivre';
  }
  if (urlLower.includes('aliexpress.com')) {
    return 'aliexpress';
  }
  if (urlLower.includes('magazineluiza.com')) {
    return 'magazineluiza';
  }
  if (urlLower.includes('casasbahia.com')) {
    return 'casasbahia';
  }

  return 'unknown';
};

/**
 * Convert Amazon affiliate link
 */
const convertAmazonLink = (url, affiliateId) => {
  try {
    const urlObj = new URL(url);

    // Remove existing affiliate tags
    urlObj.searchParams.delete('tag');
    urlObj.searchParams.delete('linkCode');
    urlObj.searchParams.delete('linkId');

    // Add user's affiliate ID
    urlObj.searchParams.set('tag', affiliateId);

    return urlObj.toString();
  } catch (error) {
    logger.error('Error converting Amazon link:', error);
    return url;
  }
};

/**
 * Convert Shopee affiliate link
 */
const convertShopeeLink = (url, affiliateId) => {
  try {
    const urlObj = new URL(url);

    // Add affiliate parameter
    urlObj.searchParams.set('af_siteid', affiliateId);

    return urlObj.toString();
  } catch (error) {
    logger.error('Error converting Shopee link:', error);
    return url;
  }
};

/**
 * Convert Mercado Livre affiliate link
 */
const convertMercadoLivreLink = (url, affiliateId) => {
  try {
    const urlObj = new URL(url);

    // Add affiliate parameter
    urlObj.searchParams.set('pdp_source', affiliateId);

    return urlObj.toString();
  } catch (error) {
    logger.error('Error converting Mercado Livre link:', error);
    return url;
  }
};

/**
 * Convert affiliate link based on platform
 */
const convertAffiliateLink = (url, affiliateIds) => {
  const platform = detectPlatform(url);

  switch (platform) {
    case 'amazon':
      if (affiliateIds.amazon) {
        return convertAmazonLink(url, affiliateIds.amazon);
      }
      break;
    case 'shopee':
      if (affiliateIds.shopee) {
        return convertShopeeLink(url, affiliateIds.shopee);
      }
      break;
    case 'mercadolivre':
      if (affiliateIds.mercadolivre) {
        return convertMercadoLivreLink(url, affiliateIds.mercadolivre);
      }
      break;
    default:
      logger.debug(`Platform ${platform} not supported for affiliate conversion`);
  }

  return url;
};

/**
 * Generate hash for URL to check duplicates
 */
const generateUrlHash = (url) => {
  return crypto.createHash('sha256').update(url).digest('hex');
};

module.exports = {
  detectPlatform,
  convertAffiliateLink,
  generateUrlHash,
};
