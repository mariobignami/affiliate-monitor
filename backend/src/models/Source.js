const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Source = sequelize.define('Source', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('rss', 'scraper', 'api'),
    allowNull: false,
    comment: 'Type of source: RSS feed, web scraper, or API',
  },
  url: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      isUrl: true,
    },
  },
  config: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Configuration specific to source type (selectors, API keys, etc.)',
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  lastFetchedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  fetchCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  errorCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  lastError: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'sources',
  timestamps: true,
  indexes: [
    {
      fields: ['userId'],
    },
    {
      fields: ['type'],
    },
    {
      fields: ['active'],
    },
  ],
});

module.exports = Source;
