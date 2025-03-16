/**
 * File: inovacademico/backend/src/controllers/bibliographyController.js
 * Controller para correção e gerenciamento de bibliografias
 */
const Feedback = require('../models/Feedback');
const Stats = require('../models/Stats');
const openRouterService = require('../services/openRouterService');
const openAIService = require('../services/openAIService');
const logger = require('../utils/logger');

/**
 * Controlador de Bibliografia
 */
const bibliographyController = {
  /**
   * Corrigir bibliografia de acordo com norma especificada
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async correctBibliography(req, res, next) {
    try {
      const { bibliography, style = 'abnt' } = req.body;
      
      if (!bibliography) {
        logger.warn('Tentativa de corrigir bibliografia sem texto fornecido');
        return res.status(400).json({
          success: false,
          message: 'O texto da bibliografia é obrigatório'
        });
      }
      
      logger.info(`Iniciando correção de bibliografia (${bibliography.length} caracteres)`, { 
        style,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });
      
      // Validar estilo
      const validStyles = ['abnt', 'apa', 'vancouver', 'mla'];
      if (!validStyles.includes(style.toLowerCase())) {
        logger.warn(`Estilo de citação inválido: ${style}`);
        return res.status(400).json({
          success: false,
          message: `Estilo de citação inválido. Escolha entre: ${validStyles.join(', ')}`
        });
      }
      
      try {
        // Tentar com OpenRouter primeiro (serviço padrão)
        logger.debug('Tentando correção com OpenRouter');
        const correctedText = await openRouterService.correctBibliography(bibliography, style);
        
        // Incrementar contador de correções
        await Stats.incrementCorrections(style);
        
        logger.info('Bibliografia corrigida com sucesso usando OpenRouter', {
          style,
          originalLength: bibliography.length,
          correctedLength: correctedText.length
        });
        
        // Formatar resultado
        const result = {
          corrected: correctedText,
          changes: [],
        };
        
        return res.status(200).json({
          success: true,
          data: {
            original: bibliography,
            corrected: result.corrected,
            changes: result.changes || [],
            style,
            provider: 'openrouter'
          }
        });
      } catch (openRouterError) {
        // Se o OpenRouter falhar, tentar com OpenAI como fallback
        logger.warn('Falha no OpenRouter, tentando com OpenAI como fallback', { 
          error: openRouterError.message 
        });
        
        const correctionResult = await openAIService.correctBibliography(bibliography, style);
        
        // Verificar se a correção foi bem-sucedida
        if (!correctionResult || !correctionResult.corrected) {
          logger.error('Falha na correção da bibliografia', { 
            error: 'Resposta inválida do serviço de IA',
            result: correctionResult
          });
          return res.status(500).json({
            success: false,
            message: 'Erro ao processar a correção da bibliografia'
          });
        }
        
        // Incrementar contador de correções
        await Stats.incrementCorrections(style);
        
        logger.info('Bibliografia corrigida com sucesso usando OpenAI (fallback)', {
          style,
          originalLength: bibliography.length,
          correctedLength: correctionResult.corrected.length,
          changesCount: correctionResult.changes?.length || 0
        });
        
        return res.status(200).json({
          success: true,
          data: {
            original: bibliography,
            corrected: correctionResult.corrected,
            changes: correctionResult.changes || [],
            style,
            provider: 'openai'
          }
        });
      }
    } catch (error) {
      logger.error('Erro na correção de bibliografia', { 
        error: error.message,
        stack: error.stack
      });
      next(error);
    }
  },
  
  /**
   * Receber feedback sobre correção de bibliografia
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async submitFeedback(req, res, next) {
    try {
      const { rating, comment, original, corrected } = req.body;
      
      if (rating === undefined || rating === null) {
        logger.warn('Tentativa de enviar feedback sem avaliação');
        return res.status(400).json({
          success: false,
          message: 'A avaliação é obrigatória'
        });
      }
      
      if (rating < 1 || rating > 5) {
        logger.warn(`Avaliação inválida: ${rating}`);
        return res.status(400).json({
          success: false,
          message: 'A avaliação deve estar entre 1 e 5'
        });
      }
      
      logger.info(`Recebendo feedback com avaliação ${rating}`, {
        ipAddress: req.ip,
        hasComment: !!comment
      });
      
      // Criar novo feedback
      const feedback = new Feedback({
        rating,
        comment,
        original,
        corrected,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });
      
      // Salvar feedback
      await feedback.save();
      
      // Atualizar média de avaliações
      await Stats.updateAverageRating();
      
      logger.info('Feedback salvo com sucesso', { 
        feedbackId: feedback._id 
      });
      
      return res.status(201).json({
        success: true,
        message: 'Feedback recebido com sucesso',
        data: {
          id: feedback._id,
          rating: feedback.rating
        }
      });
    } catch (error) {
      logger.logDBError('saveFeedback', error, 'Feedback');
      next(error);
    }
  },
  
  /**
   * Obter estatísticas de correções de bibliografia
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getBibliographyStats(req, res, next) {
    try {
      logger.debug('Obtendo estatísticas de correções de bibliografia');
      
      // Obter estatísticas
      const stats = await Stats.getStats();
      
      logger.debug('Estatísticas recuperadas com sucesso');
      
      return res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      logger.logDBError('getStats', error, 'Stats');
      next(error);
    }
  }
};

module.exports = bibliographyController; 