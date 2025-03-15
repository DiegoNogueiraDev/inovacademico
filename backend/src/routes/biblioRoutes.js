/**
 * File: inovacademico/backend/src/routes/biblioRoutes.js
 * API routes for bibliography correction
 */
const express = require('express');
const { body } = require('express-validator');
const biblioController = require('../controllers/biblioController');

const router = express.Router();

/**
 * @route   POST /api/bibliography/correct
 * @desc    Correct a bibliography
 * @access  Public
 */
router.post(
  '/correct',
  [
    // Validation middleware
    body('bibliography')
      .notEmpty()
      .withMessage('Bibliografia é obrigatória')
      .isString()
      .withMessage('Bibliografia deve ser um texto')
      .trim(),
    body('style')
      .optional()
      .isString()
      .withMessage('Estilo deve ser um texto')
      .isIn(['abnt', 'apa', 'vancouver', 'mla'])
      .withMessage('Estilo inválido. Deve ser um dos seguintes: abnt, apa, vancouver, mla')
  ],
  biblioController.correctBibliography
);

/**
 * @route   POST /api/bibliography/feedback
 * @desc    Submit feedback for a bibliography correction
 * @access  Public
 */
router.post(
  '/feedback',
  [
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Avaliação deve ser um número entre 1 e 5'),
    body('comment')
      .optional()
      .isString()
      .withMessage('Comentário deve ser um texto'),
    body('original')
      .isString()
      .withMessage('Bibliografia original deve ser um texto'),
    body('corrected')
      .isString()
      .withMessage('Bibliografia corrigida deve ser um texto')
  ],
  biblioController.submitFeedback
);

module.exports = router;