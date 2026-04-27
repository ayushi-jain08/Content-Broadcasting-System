const { User } = require('../models');
const generateToken = require('../utils/generateToken');
const sendResponse = require('../utils/response');
const { STATUS } = require('../utils/constants');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return sendResponse(res, STATUS.BAD_REQUEST, 'Please provide all required fields');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendResponse(res, STATUS.BAD_REQUEST, 'Please provide a valid email address');
    }

    if (password.length < 6) {
      return sendResponse(res, STATUS.BAD_REQUEST, 'Password must be at least 6 characters long');
    }

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return sendResponse(res, STATUS.BAD_REQUEST, 'User already exists');
    }

    const user = await User.create({ name, email, password, role });

    return sendResponse(res, STATUS.CREATED, 'User registered successfully', {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id, user.role)
    });
  } catch (error) {
    return sendResponse(res, STATUS.ERROR, error.message);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendResponse(res, STATUS.BAD_REQUEST, 'Please provide email and password');
    }

    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) {
      return sendResponse(res, STATUS.UNAUTHORIZED, 'Invalid email or password');
    }

    return sendResponse(res, STATUS.SUCCESS, 'Logged in successfully', {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id, user.role)
    });
  } catch (error) {
    return sendResponse(res, STATUS.ERROR, error.message);
  }
};
