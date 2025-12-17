const { Rule, Source, Channel } = require('../../models');
const logger = require('../../utils/logger');

/**
 * Get all rules for current user
 */
const getRules = async (req, res, next) => {
  try {
    const rules = await Rule.findAll({
      where: { userId: req.user.id },
      include: ['source', 'channel'],
      order: [['priority', 'DESC'], ['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: rules,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single rule by ID
 */
const getRule = async (req, res, next) => {
  try {
    const rule = await Rule.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
      include: ['source', 'channel'],
    });

    if (!rule) {
      return res.status(404).json({
        success: false,
        message: 'Rule not found',
      });
    }

    res.json({
      success: true,
      data: rule,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new rule
 */
const createRule = async (req, res, next) => {
  try {
    // Verify source and channel belong to user
    const [source, channel] = await Promise.all([
      Source.findOne({ where: { id: req.body.sourceId, userId: req.user.id } }),
      Channel.findOne({ where: { id: req.body.channelId, userId: req.user.id } }),
    ]);

    if (!source) {
      return res.status(404).json({
        success: false,
        message: 'Source not found',
      });
    }

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: 'Channel not found',
      });
    }

    const rule = await Rule.create({
      ...req.body,
      userId: req.user.id,
    });

    logger.info(`Rule created: ${rule.name} by user ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: 'Rule created successfully',
      data: rule,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a rule
 */
const updateRule = async (req, res, next) => {
  try {
    const rule = await Rule.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!rule) {
      return res.status(404).json({
        success: false,
        message: 'Rule not found',
      });
    }

    // If updating sourceId or channelId, verify they belong to user
    if (req.body.sourceId) {
      const source = await Source.findOne({
        where: { id: req.body.sourceId, userId: req.user.id },
      });
      if (!source) {
        return res.status(404).json({
          success: false,
          message: 'Source not found',
        });
      }
    }

    if (req.body.channelId) {
      const channel = await Channel.findOne({
        where: { id: req.body.channelId, userId: req.user.id },
      });
      if (!channel) {
        return res.status(404).json({
          success: false,
          message: 'Channel not found',
        });
      }
    }

    await rule.update(req.body);

    logger.info(`Rule updated: ${rule.name} by user ${req.user.email}`);

    res.json({
      success: true,
      message: 'Rule updated successfully',
      data: rule,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a rule
 */
const deleteRule = async (req, res, next) => {
  try {
    const rule = await Rule.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!rule) {
      return res.status(404).json({
        success: false,
        message: 'Rule not found',
      });
    }

    await rule.destroy();

    logger.info(`Rule deleted: ${rule.name} by user ${req.user.email}`);

    res.json({
      success: true,
      message: 'Rule deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRules,
  getRule,
  createRule,
  updateRule,
  deleteRule,
};
