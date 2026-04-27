const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Analytics = sequelize.define('Analytics', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  content_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  view_count: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Analytics;
