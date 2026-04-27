const express = require('express');
const { 
  uploadContent, 
  getAllContent, 
  getMyContent, 
  updateContentStatus 
} = require('../controllers/contentController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.post('/upload', protect, authorize('teacher'), upload.single('file'), uploadContent);
router.get('/all', protect, authorize('principal'), getAllContent);
router.get('/my', protect, authorize('teacher'), getMyContent);
router.put('/:id/status', protect, authorize('principal'), updateContentStatus);

module.exports = router;
