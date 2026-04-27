const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Content = sequelize.define('Content', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  file_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  file_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  file_size: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  uploaded_by: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('uploaded', 'pending', 'approved', 'rejected'),
    defaultValue: 'uploaded',
  },
  rejection_reason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  approved_by: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  approved_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  start_time: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  end_time: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Content;
