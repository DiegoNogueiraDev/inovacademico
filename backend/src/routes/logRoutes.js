/**
 * File: inovacademico/backend/src/routes/logRoutes.js
 * Rotas para recebimento de logs do cliente
 */
const express = require('express');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @route   POST /api/logs/client-error
 * @desc    Receber logs de erro do cliente
 * @access  Public
 */
router.post('/client-error', (req, res) => {
  try {
    const { message, timestamp, userAgent, url, stack, name, metadata } = req.body;

    // Registrar o erro do cliente no sistema de logs do servidor
    logger.error(`Cliente Error [${name}]: ${message}`, {
      clientTimestamp: timestamp,
      userAgent,
      clientUrl: url,
      stack,
      metadata,
      ip: req.ip
    });

    res.status(200).json({ success: true, message: 'Log recebido com sucesso' });
  } catch (error) {
    logger.error('Erro ao processar log do cliente', { error });
    res.status(500).json({ success: false, message: 'Erro ao processar log' });
  }
});

/**
 * @route   POST /api/logs/client-analytics
 * @desc    Receber dados de analytics do cliente (ex: ações do usuário)
 * @access  Public
 */
router.post('/client-analytics', (req, res) => {
  try {
    const { action, details, timestamp, url } = req.body;

    // Registrar ação do usuário
    logger.info(`Cliente Analytics: ${action}`, {
      action,
      details,
      clientTimestamp: timestamp,
      clientUrl: url,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(200).json({ success: true, message: 'Analytics recebido com sucesso' });
  } catch (error) {
    logger.error('Erro ao processar analytics do cliente', { error });
    res.status(500).json({ success: false, message: 'Erro ao processar analytics' });
  }
});

module.exports = router; 