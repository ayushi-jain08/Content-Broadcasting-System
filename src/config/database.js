const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Helper to get CA cert safely
const getCACert = () => {
  // 1. Check Environment Variable (Best for Cloud/Render)
  if (process.env.DB_CA_CERT) {
    return process.env.DB_CA_CERT;
  }

  // 2. Check Local File (Best for Local Development)
  const localPath = path.join(__dirname, '../ca.pem');
  if (fs.existsSync(localPath)) {
    return fs.readFileSync(localPath);
  }

  // 3. Fallback (If both are missing, we log a warning but don't crash here)
  console.log('Warning: No CA certificate found in DB_CA_CERT or src/ca.pem');
  return null;
};

const caCert = getCACert();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      ssl: caCert ? {
        ca: caCert,
        rejectUnauthorized: true,
      } : false, // Disable SSL if no cert is found
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
