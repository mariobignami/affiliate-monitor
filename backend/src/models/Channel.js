const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Channel = sequelize.define('Channel', {
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
    type: DataTypes.ENUM('telegram', 'whatsapp', 'discord'),
    allowNull: false,
    comment: 'Type of messaging channel',
  },
  config: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Channel-specific configuration (bot token, chat ID, etc.)',
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  messageCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  lastMessageAt: {
    type: DataTypes.DATE,
    allowNull: true,
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
  tableName: 'channels',
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

module.exports = Channel;
