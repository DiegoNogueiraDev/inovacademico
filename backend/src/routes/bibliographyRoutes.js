/**
 * File: inovacademico/backend/src/routes/bibliographyRoutes.js
 * Rotas para correção e gerenciamento de bibliografias
 */
const express = require('express');
const bibliographyController = require('../controllers/bibliographyController');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @route   POST /api/bibliography/correct
 * @desc    Corrigir bibliografia de acordo com norma especificada
 * @access  Public
 */
router.post('/correct', bibliographyController.correctBibliography);

/**
 * @route   POST /api/bibliography/feedback
 * @desc    Receber feedback sobre correção de bibliografia
 * @access  Public
 */
router.post('/feedback', bibliographyController.submitFeedback);

/**
 * @route   GET /api/bibliography/stats
 * @desc    Obter estatísticas de correções de bibliografia
 * @access  Public
 */
router.get('/stats', bibliographyController.getBibliographyStats);

module.exports = router; 