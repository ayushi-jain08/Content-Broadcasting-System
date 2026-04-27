const redis = require('redis');

let redisClient;

const initRedis = async () => {
  if (process.env.REDIS_URL) {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL
    });

    redisClient.on('error', (err) => console.log('Redis Client Error', err));

    try {
      await redisClient.connect();
      console.log('Connected to Redis successfully');
    } catch (err) {
      console.log('Redis Connection Failed (Skipping Cache)');
      redisClient = null;
    }
  }
};

const getRedisClient = () => redisClient;

module.exports = { initRedis, getRedisClient };
