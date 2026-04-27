const User = require('./User');
const Content = require('./Content');
const ContentSlot = require('./ContentSlot');
const ContentSchedule = require('./ContentSchedule');
const Analytics = require('./Analytics');

// Associations
User.hasMany(Content, { foreignKey: 'uploaded_by', as: 'uploadedFiles' });
Content.belongsTo(User, { foreignKey: 'uploaded_by', as: 'uploader' });

User.hasMany(Content, { foreignKey: 'approved_by', as: 'approvedFiles' });
Content.belongsTo(User, { foreignKey: 'approved_by', as: 'approver' });

Content.hasMany(ContentSchedule, { foreignKey: 'content_id', as: 'schedules' });
ContentSchedule.belongsTo(Content, { foreignKey: 'content_id', as: 'content' });

ContentSlot.hasMany(ContentSchedule, { foreignKey: 'slot_id', as: 'schedules' });
ContentSchedule.belongsTo(ContentSlot, { foreignKey: 'slot_id', as: 'slot' });

Content.hasMany(Analytics, { foreignKey: 'content_id', as: 'analytics' });
Analytics.belongsTo(Content, { foreignKey: 'content_id', as: 'content' });

module.exports = {
  User,
  Content,
  ContentSlot,
  ContentSchedule,
  Analytics
};
