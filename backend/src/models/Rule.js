const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Rule = sequelize.define('Rule', {
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
  sourceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'sources',
      key: 'id',
    },
  },
  channelId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'channels',
      key: 'id',
    },
  },
  filters: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Filter conditions (keywords, price range, discount, etc.)',
  },
  priority: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Higher priority rules are evaluated first',
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  matchCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  lastMatchedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'rules',
  timestamps: true,
  indexes: [
    {
      fields: ['userId'],
    },
    {
      fields: ['sourceId'],
    },
    {
      fields: ['channelId'],
    },
    {
      fields: ['active'],
    },
    {
      fields: ['priority'],
    },
  ],
});

module.exports = Rule;
