const { Content, ContentSlot, ContentSchedule } = require('../models');
const cloudinary = require('cloudinary').v2;
const sendResponse = require('../utils/response');
const { STATUS } = require('../utils/constants');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadContent = async (req, res) => {
  try {
    const { title, description, subject, start_time, end_time, duration } = req.body;

    if (!req.file) {
      return sendResponse(res, STATUS.BAD_REQUEST, 'Please upload a file');
    }

    if (!title || !subject) {
      return sendResponse(res, STATUS.BAD_REQUEST, 'Title and Subject are required');
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'content_broadcasting'
    });

    const content = await Content.create({
      title,
      description,
      subject,
      file_url: result.secure_url,
      file_type: req.file.mimetype,
      file_size: req.file.size,
      uploaded_by: req.user.id,
      start_time: start_time || null,
      end_time: end_time || null,
      duration: duration || 5,
      status: 'uploaded'
    });

    return sendResponse(res, STATUS.CREATED, 'Content uploaded successfully', content);
  } catch (error) {
    return sendResponse(res, STATUS.ERROR, error.message);
  }
};

exports.getAllContent = async (req, res) => {
  try {
    const { status, subject, teacherId, page = 1, limit = 10 } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (subject) filter.subject = subject;
    if (teacherId) filter.uploaded_by = teacherId;

    const offset = (page - 1) * parseInt(limit);

    const { count, rows } = await Content.findAndCountAll({
      where: filter,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    return sendResponse(res, STATUS.SUCCESS, 'Content retrieved successfully', rows, {
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    return sendResponse(res, STATUS.ERROR, error.message);
  }
};

exports.getMyContent = async (req, res) => {
  try {
    const contents = await Content.findAll({
      where: { uploaded_by: req.user.id },
      order: [['created_at', 'DESC']]
    });
    return sendResponse(res, STATUS.SUCCESS, 'My content retrieved successfully', contents);
  } catch (error) {
    return sendResponse(res, STATUS.ERROR, error.message);
  }
};

exports.updateContentStatus = async (req, res) => {
  try {
    const { status, rejection_reason } = req.body;
    const content = await Content.findByPk(req.params.id);

    if (!content) {
      return sendResponse(res, STATUS.NOT_FOUND, 'Content not found');
    }

    content.status = status;
    
    if (status === 'rejected') {
      content.rejection_reason = rejection_reason;
    } else if (status === 'approved') {
      content.approved_by = req.user.id;
      content.approved_at = new Date();
      
      let [slot] = await ContentSlot.findOrCreate({
        where: { subject: content.subject }
      });

      const maxOrder = await ContentSchedule.max('rotation_order', { 
        where: { slot_id: slot.id } 
      }) || 0;
      
      await ContentSchedule.create({
        content_id: content.id,
        slot_id: slot.id,
        rotation_order: maxOrder + 1,
        duration: content.duration || 5
      });
    }

    await content.save();
    return sendResponse(res, STATUS.SUCCESS, `Content status updated to ${status}`, content);
  } catch (error) {
    return sendResponse(res, STATUS.ERROR, error.message);
  }
};
