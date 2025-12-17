const { Source } = require('../../models');
const logger = require('../../utils/logger');

/**
 * Get all sources for current user
 */
const getSources = async (req, res, next) => {
  try {
    const sources = await Source.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: sources,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single source by ID
 */
const getSource = async (req, res, next) => {
  try {
    const source = await Source.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!source) {
      return res.status(404).json({
        success: false,
        message: 'Source not found',
      });
    }

    res.json({
      success: true,
      data: source,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new source
 */
const createSource = async (req, res, next) => {
  try {
    const source = await Source.create({
      ...req.body,
      userId: req.user.id,
    });

    logger.info(`Source created: ${source.name} by user ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: 'Source created successfully',
      data: source,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a source
 */
const updateSource = async (req, res, next) => {
  try {
    const source = await Source.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!source) {
      return res.status(404).json({
        success: false,
        message: 'Source not found',
      });
    }

    await source.update(req.body);

    logger.info(`Source updated: ${source.name} by user ${req.user.email}`);

    res.json({
      success: true,
      message: 'Source updated successfully',
      data: source,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a source
 */
const deleteSource = async (req, res, next) => {
  try {
    const source = await Source.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!source) {
      return res.status(404).json({
        success: false,
        message: 'Source not found',
      });
    }

    await source.destroy();

    logger.info(`Source deleted: ${source.name} by user ${req.user.email}`);

    res.json({
      success: true,
      message: 'Source deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSources,
  getSource,
  createSource,
  updateSource,
  deleteSource,
};
