const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const getCACert = () => {
  if (process.env.DB_CA_CERT) return process.env.DB_CA_CERT;
  const paths = [
    path.join(__dirname, '../ca.pem'),
    path.join(__dirname, '../../ca.pem'),
    path.join(process.cwd(), 'ca.pem'),
    path.join(process.cwd(), 'src/ca.pem')
  ];
  for (const p of paths) {
    if (fs.existsSync(p)) return fs.readFileSync(p);
  }
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
      } : false,
      // Fix for "Incorrect datetime value"
      dateStrings: true,
      typeCast: true
    },
    timezone: '+05:30', // Set to your local timezone
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
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
