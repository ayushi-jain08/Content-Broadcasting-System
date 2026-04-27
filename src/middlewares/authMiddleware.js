const jwt = require('jsonwebtoken');
const { User } = require('../models');
const sendResponse = require('../utils/response');
const { STATUS } = require('../utils/constants');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password_hash'] }
      });

      if (!req.user) {
        return sendResponse(res, STATUS.UNAUTHORIZED, 'User not found');
      }

      next();
    } catch (error) {
      return sendResponse(res, STATUS.UNAUTHORIZED, 'Not authorized');
    }
  }

  if (!token) {
    return sendResponse(res, STATUS.UNAUTHORIZED, 'No token provided');
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendResponse(res, STATUS.FORBIDDEN, 'Permission denied');
    }
    next();
  };
};

module.exports = { protect, authorize };
