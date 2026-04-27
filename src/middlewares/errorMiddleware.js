const sendResponse = require('../utils/response');
const { STATUS } = require('../utils/constants');

const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || STATUS.ERROR;
  const message = err.message || 'Internal Server Error';
  
  // Log error for developers
  if (process.env.NODE_ENV === 'development') {
    console.error(`[Error] ${req.method} ${req.url}:`, err.stack);
  }

  return sendResponse(res, statusCode, message);
};

module.exports = errorMiddleware;
