const TelegramBot = require('node-telegram-bot-api');
const logger = require('../utils/logger');

let botInstance = null;

/**
 * Get or create Telegram bot instance
 */
const getBot = (token) => {
  if (!token) {
    throw new Error('Telegram bot token is required');
  }

  if (!botInstance || botInstance.token !== token) {
    botInstance = new TelegramBot(token, { polling: false });
  }

  return botInstance;
};

/**
 * Format offer message for Telegram
 */
const formatOfferMessage = (offer) => {
  let message = `🔥 *${offer.title}*\n\n`;

  if (offer.description) {
    const desc = offer.description.substring(0, 200);
    message += `${desc}${offer.description.length > 200 ? '...' : ''}\n\n`;
  }

  if (offer.price) {
    message += `💰 *Preço:* R$ ${offer.price.toFixed(2)}`;
    if (offer.originalPrice && offer.originalPrice > offer.price) {
      message += ` ~R$ ${offer.originalPrice.toFixed(2)}~`;
    }
    message += '\n';
  }

  if (offer.discount) {
    message += `🎁 *Desconto:* ${offer.discount}%\n`;
  }

  if (offer.platform) {
    message += `🏪 *Plataforma:* ${offer.platform}\n`;
  }

  message += `\n🔗 [Ver Oferta](${offer.affiliateUrl || offer.originalUrl})`;

  return message;
};

/**
 * Send offer to Telegram channel
 */
const sendOfferToTelegram = async (offer, config) => {
  try {
    const { botToken, chatId } = config;

    if (!botToken || !chatId) {
      throw new Error('Telegram bot token and chat ID are required');
    }

    const bot = getBot(botToken);
    const message = formatOfferMessage(offer);

    const options = {
      parse_mode: 'Markdown',
      disable_web_page_preview: false,
    };

    // If there's an image, send photo with caption
    if (offer.imageUrl) {
      try {
        await bot.sendPhoto(chatId, offer.imageUrl, {
          caption: message,
          ...options,
        });
      } catch (error) {
        // If photo fails, send as text message
        logger.warn('Failed to send photo, sending as text:', error.message);
        await bot.sendMessage(chatId, message, options);
      }
    } else {
      await bot.sendMessage(chatId, message, options);
    }

    logger.info(`Sent offer to Telegram chat ${chatId}: ${offer.title}`);
    return true;
  } catch (error) {
    logger.error('Error sending to Telegram:', error);
    throw error;
  }
};

/**
 * Test Telegram channel connection
 */
const testTelegramChannel = async (config) => {
  try {
    const { botToken, chatId } = config;

    if (!botToken || !chatId) {
      throw new Error('Telegram bot token and chat ID are required');
    }

    const bot = getBot(botToken);
    await bot.sendMessage(
      chatId,
      '✅ Conexão com Telegram configurada com sucesso!'
    );

    return true;
  } catch (error) {
    logger.error('Error testing Telegram channel:', error);
    throw error;
  }
};

module.exports = {
  sendOfferToTelegram,
  testTelegramChannel,
  formatOfferMessage,
};
