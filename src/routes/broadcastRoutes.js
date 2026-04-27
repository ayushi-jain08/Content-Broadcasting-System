const express = require('express');
const rateLimit = require('express-rate-limit');
const { getLiveContent } = require('../controllers/broadcastController');

const router = express.Router();


const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: 'Too many requests, please try again later.' }
});

router.get('/live/:teacherId', apiLimiter, getLiveContent);

module.exports = router;
