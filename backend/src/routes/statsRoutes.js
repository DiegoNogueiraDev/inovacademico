/**
 * File: inovacademico/backend/src/routes/statsRoutes.js
 * Routes for statistics
 */
const express = require('express');
const statsController = require('../controllers/statsController');

const router = express.Router();

/**
 * @route   GET /api/stats
 * @desc    Get application statistics
 * @access  Public
 */
router.get('/', statsController.getStats);

module.exports = router;