const redis = require('redis');

let redisClient = null;

const initRedis = async () => {
  // Only attempt connection if REDIS_URL is provided
  if (!process.env.REDIS_URL) {
    console.log('Redis URL not found, skipping cache initialization.');
    return;
  }

  try {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL
    });

    redisClient.on('error', (err) => {
      // Catch connection errors quietly
      if (err.code === 'ECONNREFUSED') {
        console.log('Warning: Redis connection refused. Running without cache.');
      } else {
        console.error('Redis Client Error', err);
      }
      redisClient = null;
    });

    await redisClient.connect();
    console.log('Connected to Redis successfully');
  } catch (err) {
    console.log('Redis Initialization Failed:', err.message);
    redisClient = null;
  }
};

const getRedisClient = () => redisClient;

module.exports = { initRedis, getRedisClient };
