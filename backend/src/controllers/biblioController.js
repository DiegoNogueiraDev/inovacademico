/**
 * File: inovacademico/backend/src/controllers/biblioController.js
 * Logic for handling bibliography requests
 */
const openRouterService = require('../services/openRouterService');
const Correction = require('../models/Correction');
const Stats = require('../models/Stats');

const biblioController = {
  /**
   * Correct a bibliography using the OpenRouter service
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async correctBibliography(req, res, next) {
    try {
      const { bibliography, style = 'abnt' } = req.body;

      // Validação de entrada
      if (!bibliography || typeof bibliography !== 'string' || !bibliography.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Bibliografia é obrigatória e deve ser um texto não vazio'
        });
      }

      const correctedBibliography = await openRouterService.correctBibliography(bibliography, style);

      // Caso a resposta venha vazia, retorna erro 500
      if (!correctedBibliography) {
        return res.status(500).json({
          success: false,
          message: 'A correção da bibliografia retornou um resultado vazio'
        });
      }

      // Salva a correção no banco de dados
      const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const correction = new Correction({
        original: bibliography,
        corrected: correctedBibliography,
        style,
        ipAddress,
        userAgent
      });

      await correction.save();

      // Atualiza as estatísticas
      await Stats.incrementCorrections(style);

      return res.status(200).json({
        success: true,
        data: {
          corrected: correctedBibliography,
          original: bibliography,
          style
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Submit feedback for a bibliography correction
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async submitFeedback(req, res, next) {
    try {
      const { rating, comment, original, corrected } = req.body;

      let correction = await Correction.findOne({ original, corrected });

      if (!correction) {
        correction = new Correction({
          original,
          corrected,
          rating,
          feedback: comment
        });
      } else {
        correction.rating = rating;
        correction.feedback = comment;
      }

      await correction.save();
      await Stats.updateAverageRating();

      return res.status(200).json({
        success: true,
        message: 'Feedback recebido com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = biblioController;
