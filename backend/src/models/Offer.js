const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Offer = sequelize.define('Offer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  sourceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'sources',
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  title: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  originalUrl: {
    type: DataTypes.STRING(1000),
    allowNull: false,
  },
  affiliateUrl: {
    type: DataTypes.STRING(1000),
    allowNull: true,
    comment: 'URL converted with user affiliate ID',
  },
  imageUrl: {
    type: DataTypes.STRING(1000),
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  originalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  discount: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Discount percentage',
  },
  platform: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Platform detected (amazon, shopee, mercadolivre, etc.)',
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Additional metadata from the source',
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'sent', 'failed', 'skipped'),
    defaultValue: 'pending',
  },
  sentAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  sentToChannels: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of channel IDs where this offer was sent',
  },
  hash: {
    type: DataTypes.STRING(64),
    allowNull: false,
    unique: true,
    comment: 'Hash of originalUrl to prevent duplicates',
  },
}, {
  tableName: 'offers',
  timestamps: true,
  indexes: [
    {
      fields: ['sourceId'],
    },
    {
      fields: ['userId'],
    },
    {
      fields: ['status'],
    },
    {
      fields: ['platform'],
    },
    {
      fields: ['hash'],
      unique: true,
    },
    {
      fields: ['createdAt'],
    },
  ],
});

module.exports = Offer;
