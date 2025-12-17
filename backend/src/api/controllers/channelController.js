const { Channel } = require('../../models');
const logger = require('../../utils/logger');

/**
 * Get all channels for current user
 */
const getChannels = async (req, res, next) => {
  try {
    const channels = await Channel.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: channels,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single channel by ID
 */
const getChannel = async (req, res, next) => {
  try {
    const channel = await Channel.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: 'Channel not found',
      });
    }

    res.json({
      success: true,
      data: channel,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new channel
 */
const createChannel = async (req, res, next) => {
  try {
    const channel = await Channel.create({
      ...req.body,
      userId: req.user.id,
    });

    logger.info(`Channel created: ${channel.name} by user ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: 'Channel created successfully',
      data: channel,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a channel
 */
const updateChannel = async (req, res, next) => {
  try {
    const channel = await Channel.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: 'Channel not found',
      });
    }

    await channel.update(req.body);

    logger.info(`Channel updated: ${channel.name} by user ${req.user.email}`);

    res.json({
      success: true,
      message: 'Channel updated successfully',
      data: channel,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a channel
 */
const deleteChannel = async (req, res, next) => {
  try {
    const channel = await Channel.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: 'Channel not found',
      });
    }

    await channel.destroy();

    logger.info(`Channel deleted: ${channel.name} by user ${req.user.email}`);

    res.json({
      success: true,
      message: 'Channel deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getChannels,
  getChannel,
  createChannel,
  updateChannel,
  deleteChannel,
};
