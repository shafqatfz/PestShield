const express = require('express');
const router = express.Router();
const { getPests, getLifecycle } = require('../controllers/pestController');

router.get('/', getPests);
router.get('/lifecycle/:crop', getLifecycle);

module.exports = router;
