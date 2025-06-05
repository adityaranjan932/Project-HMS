const express = require('express');
const router = express.Router();
const {
  upload,
  createNotice,
  getAllNotices,
  getPublishedNotices,
  getNoticeById,
  updateNotice,
  deleteNotice,
  publishNotice
} = require('../controllers/publicNoticeController');
const auth = require('../middleware/auth');

// Public routes (no authentication required)
router.get('/published', getPublishedNotices);
router.get('/public/:id', getNoticeById);

// Protected routes (authentication required)
router.use(auth);

// Create a new notice with file upload
router.post('/', upload.array('attachments', 5), createNotice);

// Get all notices (for admin/provost)
router.get('/', getAllNotices);

// Get specific notice
router.get('/:id', getNoticeById);

// Update notice
router.put('/:id', upload.array('attachments', 5), updateNotice);

// Delete notice
router.delete('/:id', deleteNotice);

// Publish a draft notice
router.patch('/:id/publish', publishNotice);

module.exports = router;
