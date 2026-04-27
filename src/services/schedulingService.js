const { Content, ContentSchedule } = require('../models');
const { Op } = require('sequelize');

exports.getActiveContentForTeacher = async (teacherId, subject = null) => {
  const now = new Date();

  const whereClause = {
    uploaded_by: teacherId,
    status: 'approved',
    start_time: { [Op.lte]: now },
    end_time: { [Op.gte]: now }
  };

  if (subject) {
    whereClause.subject = subject;
  }

  const activeContents = await Content.findAll({
    where: whereClause,
    include: [{
      model: ContentSchedule,
      as: 'schedules'
    }],
    order: [
      ['subject', 'ASC'],
      [{ model: ContentSchedule, as: 'schedules' }, 'rotation_order', 'ASC']
    ]
  });

  if (!activeContents || activeContents.length === 0) {
    return null;
  }

  const subjects = {};
  activeContents.forEach(content => {
    if (!subjects[content.subject]) subjects[content.subject] = [];
    subjects[content.subject].push(content);
  });

  const results = {};

  for (const sub in subjects) {
    const contents = subjects[sub];
    const totalDuration = contents.reduce((acc, c) => {
      const d = (c.schedules && c.schedules[0]) ? c.schedules[0].duration : 5;
      return acc + d;
    }, 0);

    const totalDurationMs = totalDuration * 60 * 1000;
    const currentRotationTimeMs = (now.getTime()) % totalDurationMs;

    let elapsedMs = 0;
    let activeForSubject = contents[0];

    for (const c of contents) {
      const d = (c.schedules && c.schedules[0]) ? c.schedules[0].duration : 5;
      const dMs = d * 60 * 1000;
      if (currentRotationTimeMs >= elapsedMs && currentRotationTimeMs < elapsedMs + dMs) {
        activeForSubject = c;
        break;
      }
      elapsedMs += dMs;
    }
    results[sub] = activeForSubject;
  }

  return subject ? results[subject] : results;
};
