const schedulingService = require('../services/schedulingService');
const { Analytics } = require('../models');
const { getRedisClient } = require('../config/redis');
const sendResponse = require('../utils/response');
const { STATUS } = require('../utils/constants');

exports.getLiveContent = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { subject } = req.query;
    
    const redis = getRedisClient();
    const cacheKey = `live:${teacherId}:${subject || 'all'}`;
    
    if (redis) {
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        return sendResponse(res, STATUS.SUCCESS, 'Live content retrieved (cached)', parsedData, { fromCache: true });
      }
    }

    const activeContent = await schedulingService.getActiveContentForTeacher(teacherId, subject);

    let responseData;
    let ttl = 60;

    if (!activeContent || Object.keys(activeContent).length === 0) {
      responseData = { message: "No content available" };
      ttl = 10;
    } else {
      responseData = activeContent;
    }

    if (redis) {
      await redis.set(cacheKey, JSON.stringify(responseData), { EX: ttl });
    }

    if (activeContent && Object.keys(activeContent).length > 0) {
      const itemsToTrack = subject ? [activeContent] : Object.values(activeContent);
      for (const item of itemsToTrack) {
        const [analytic] = await Analytics.findOrCreate({
          where: { content_id: item.id },
          defaults: { subject: item.subject }
        });
        await analytic.increment('view_count');
      }
    }

    return sendResponse(res, STATUS.SUCCESS, 'Live content retrieved', responseData, { fromCache: false });
  } catch (error) {
    return sendResponse(res, STATUS.ERROR, error.message);
  }
};
