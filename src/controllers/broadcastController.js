const schedulingService = require('../services/schedulingService');
const { Analytics } = require('../models');

exports.getLiveContent = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { subject } = req.query;
    const activeContent = await schedulingService.getActiveContentForTeacher(teacherId, subject);

    if (!activeContent || Object.keys(activeContent).length === 0) {
      return res.status(200).json({ message: "No content available" });
    }

    const itemsToTrack = subject ? [activeContent] : Object.values(activeContent);

    for (const item of itemsToTrack) {
      const [analytic] = await Analytics.findOrCreate({
        where: { content_id: item.id },
        defaults: { subject: item.subject }
      });
      await analytic.increment('view_count');
    }

    res.json({
      success: true,
      data: activeContent
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
