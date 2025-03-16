/**
 * File: inovacademico/backend/src/routes/statsRoutes.js
 * Rotas para gerenciamento de estatísticas
 */
const express = require('express');
const statsController = require('../controllers/statsController');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @route   GET /api/stats
 * @desc    Obter estatísticas gerais do sistema
 * @access  Public
 */
router.get('/', statsController.getStats);

/**
 * @route   POST /api/stats/increment-corrections
 * @desc    Incrementar contador de correções para um estilo específico
 * @access  Public
 */
router.post('/increment-corrections', statsController.incrementCorrections);

/**
 * @route   POST /api/stats/update-rating
 * @desc    Atualizar média de avaliações
 * @access  Public
 */
router.post('/update-rating', statsController.updateAverageRating);

module.exports = router;