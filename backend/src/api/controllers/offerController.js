const { Offer } = require('../../models');
const { Op } = require('sequelize');

/**
 * Get all offers with filters
 */
const getOffers = async (req, res, next) => {
  try {
    const {
      status,
      platform,
      sourceId,
      page = 1,
      limit = 20,
    } = req.query;

    const where = { userId: req.user.id };

    if (status) where.status = status;
    if (platform) where.platform = platform;
    if (sourceId) where.sourceId = sourceId;

    const offset = (page - 1) * limit;

    const { count, rows: offers } = await Offer.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      include: ['source'],
    });

    res.json({
      success: true,
      data: {
        offers,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single offer by ID
 */
const getOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
      include: ['source'],
    });

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found',
      });
    }

    res.json({
      success: true,
      data: offer,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get offer statistics
 */
const getStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [
      totalOffers,
      pendingOffers,
      sentOffers,
      failedOffers,
    ] = await Promise.all([
      Offer.count({ where: { userId } }),
      Offer.count({ where: { userId, status: 'pending' } }),
      Offer.count({ where: { userId, status: 'sent' } }),
      Offer.count({ where: { userId, status: 'failed' } }),
    ]);

    res.json({
      success: true,
      data: {
        total: totalOffers,
        pending: pendingOffers,
        sent: sentOffers,
        failed: failedOffers,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOffers,
  getOffer,
  getStats,
};
