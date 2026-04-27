const sendResponse = (res, code, message, data = null, extra = {}) => {
  const response = {
    success: code < 400,
    message,
    ...(data && { data }),
    ...extra
  };
  return res.status(code).json(response);
};

module.exports = sendResponse;
