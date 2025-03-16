/**
 * File: inovacademico/backend/src/controllers/statsController.js
 * Controller for statistics
 */
const Stats = require('../models/Stats');
const logger = require('../utils/logger');

/**
 * Statistics controller
 */
const statsController = {
  /**
   * Get current statistics
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getStats(req, res, next) {
    try {
      logger.debug('Buscando estatísticas do sistema');
      
      const stats = await Stats.getStats();
      
      logger.debug('Estatísticas recuperadas com sucesso', { stats });
      
      return res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      logger.logDBError('getStats', error, 'Stats');
      next(error);
    }
  },
  
  /**
   * Increment correction count for a specific style
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async incrementCorrections(req, res, next) {
    try {
      const { style } = req.body;
      
      if (!style) {
        logger.warn('Tentativa de incrementar correções sem especificar estilo', { 
          body: req.body, 
          ip: req.ip 
        });
        
        return res.status(400).json({
          success: false,
          message: 'Estilo de citação é obrigatório'
        });
      }
      
      logger.info(`Incrementando contador de correções para estilo: ${style}`);
      
      const stats = await Stats.incrementCorrections(style);
      
      logger.debug('Contador incrementado com sucesso', { 
        style,
        newTotalCount: stats.totalCorrections,
        newStyleCount: stats.correctionsByStyle[style] 
      });
      
      return res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      logger.logDBError('incrementCorrections', error, 'Stats');
      next(error);
    }
  },
  
  /**
   * Update average rating based on user feedback
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async updateAverageRating(req, res, next) {
    try {
      logger.debug('Atualizando média de avaliações');
      
      const stats = await Stats.updateAverageRating();
      
      logger.info('Média de avaliações atualizada', { 
        newAverageRating: stats.averageRating 
      });
      
      return res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      logger.logDBError('updateAverageRating', error, 'Stats');
      next(error);
    }
  }
};

module.exports = statsController;