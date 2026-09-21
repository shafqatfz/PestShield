const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect, adminOnly } = require('../middleware/auth');
const { createReport, getMyReports, getAllReports, verifyReport } = require('../controllers/pestReportController');

router.post('/', protect, upload.single('image'), createReport);
router.get('/my', protect, getMyReports);
router.get('/', protect, adminOnly, getAllReports);
router.put('/:id/verify', protect, adminOnly, verifyReport);

module.exports = router;
