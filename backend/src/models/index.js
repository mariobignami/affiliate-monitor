const User = require('./User');
const Source = require('./Source');
const Channel = require('./Channel');
const Offer = require('./Offer');
const Rule = require('./Rule');

// Define associations
User.hasMany(Source, { foreignKey: 'userId', as: 'sources' });
Source.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Channel, { foreignKey: 'userId', as: 'channels' });
Channel.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Offer, { foreignKey: 'userId', as: 'offers' });
Offer.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Source.hasMany(Offer, { foreignKey: 'sourceId', as: 'offers' });
Offer.belongsTo(Source, { foreignKey: 'sourceId', as: 'source' });

User.hasMany(Rule, { foreignKey: 'userId', as: 'rules' });
Rule.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Source.hasMany(Rule, { foreignKey: 'sourceId', as: 'rules' });
Rule.belongsTo(Source, { foreignKey: 'sourceId', as: 'source' });

Channel.hasMany(Rule, { foreignKey: 'channelId', as: 'rules' });
Rule.belongsTo(Channel, { foreignKey: 'channelId', as: 'channel' });

module.exports = {
  User,
  Source,
  Channel,
  Offer,
  Rule,
};
