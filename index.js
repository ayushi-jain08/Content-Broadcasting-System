const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const { connectDB, sequelize } = require('./src/config/database');
const { initRedis } = require('./src/config/redis');
const { User, Content, ContentSlot, ContentSchedule, Analytics } = require('./src/models');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const authRoutes = require('./src/routes/authRoutes');
const contentRoutes = require('./src/routes/contentRoutes');
const broadcastRoutes = require('./src/routes/broadcastRoutes');
const errorMiddleware = require('./src/middlewares/errorMiddleware');

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/content', broadcastRoutes);

// Handle 404
app.use((req, res) => {
  return sendResponse(res, STATUS.NOT_FOUND, 'API endpoint not found');
});

app.use(errorMiddleware);

app.get('/', (req, res) => {
  res.json({ message: 'Content Broadcasting System API is running' });
});

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    await initRedis();

    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Database synced');
    }

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
};

start();
