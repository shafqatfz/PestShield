const express = require('express');
const router = express.Router();
const { createFarm, getMyFarms } = require('../controllers/farmController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createFarm);
router.get('/my', protect, getMyFarms);

module.exports = router;
