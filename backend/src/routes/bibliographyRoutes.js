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

/**
 * @route   GET /api/bibliography/prompt-stats
 * @desc    Obter estatísticas dos prompts enviados aos modelos de IA
 * @access  Public
 */
router.get('/prompt-stats', bibliographyController.getPromptStats);

module.exports = router; 