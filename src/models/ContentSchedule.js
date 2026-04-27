const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ContentSchedule = sequelize.define('ContentSchedule', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  content_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  slot_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  rotation_order: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER, // in minutes
    allowNull: false,
    defaultValue: 5,
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = ContentSchedule;
