/**
 * File: inovacademico/backend/src/models/Stats.js
 * Modelo para estatísticas do sistema
 */
const mongoose = require('mongoose');
const Feedback = require('./Feedback');
const logger = require('../utils/logger');

const statsSchema = new mongoose.Schema({
  // Identificador único para garantir apenas um documento
  _id: {
    type: String,
    default: 'stats'
  },
  
  // Contadores de correções
  totalCorrections: {
    type: Number,
    default: 0
  },
  
  // Contadores por estilo de citação
  correctionsByStyle: {
    abnt: {
      type: Number,
      default: 0
    },
    apa: {
      type: Number,
      default: 0
    },
    vancouver: {
      type: Number,
      default: 0
    },
    mla: {
      type: Number,
      default: 0
    }
  },
  
  // Estatísticas de avaliações
  averageRating: {
    type: Number,
    default: 0
  },
  feedbackCount: {
    type: Number,
    default: 0
  },
  
  // Dados de uso
  activeUsers: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

/**
 * Método estático para obter estatísticas atuais
 * @returns {Promise<Object>} - Estatísticas
 */
statsSchema.statics.getStats = async function() {
  try {
    logger.debug('Buscando estatísticas do sistema');
    
    // Buscar ou criar documento de estatísticas
    let stats = await this.findById('stats');
    
    if (!stats) {
      logger.info('Criando documento de estatísticas inicial');
      stats = await this.create({ _id: 'stats' });
    }
    
    // Obter dados de feedback diretamente do modelo Feedback
    const feedbackStats = await Feedback.getFeedbackStats().catch(() => null);
    
    if (feedbackStats) {
      stats.averageRating = feedbackStats.averageRating;
      stats.feedbackCount = feedbackStats.feedbackCount;
      stats.lastUpdated = new Date();
      
      // Salvar atualizações
      await stats.save();
    }
    
    logger.debug('Estatísticas obtidas com sucesso');
    
    return stats;
  } catch (error) {
    logger.logDBError('getStats', error, 'Stats');
    throw error;
  }
};

/**
 * Método estático para incrementar contador de correções
 * @param {String} style - Estilo de citação
 * @returns {Promise<Object>} - Estatísticas atualizadas
 */
statsSchema.statics.incrementCorrections = async function(style) {
  try {
    logger.debug(`Incrementando contador de correções para ${style}`);
    style = style.toLowerCase();
    
    // Verificar se é um estilo válido
    const validStyles = ['abnt', 'apa', 'vancouver', 'mla'];
    if (!validStyles.includes(style)) {
      logger.warn(`Tentativa de incrementar contador para estilo inválido: ${style}`);
      return null;
    }
    
    // Buscar ou criar documento de estatísticas
    let stats = await this.findById('stats');
    
    if (!stats) {
      logger.info('Criando documento de estatísticas inicial');
      stats = await this.create({ _id: 'stats' });
    }
    
    // Incrementar contadores
    stats.totalCorrections += 1;
    stats.correctionsByStyle[style] += 1;
    stats.lastUpdated = new Date();
    
    // Salvar atualizações
    await stats.save();
    
    logger.debug('Contador de correções incrementado', {
      style,
      totalCorrections: stats.totalCorrections,
      styleCorrections: stats.correctionsByStyle[style]
    });
    
    return stats;
  } catch (error) {
    logger.logDBError('incrementCorrections', error, 'Stats');
    throw error;
  }
};

/**
 * Método estático para atualizar média de avaliações
 * @returns {Promise<Object>} - Estatísticas atualizadas
 */
statsSchema.statics.updateAverageRating = async function() {
  try {
    logger.debug('Atualizando média de avaliações');
    
    // Buscar ou criar documento de estatísticas
    let stats = await this.findById('stats');
    
    if (!stats) {
      logger.info('Criando documento de estatísticas inicial');
      stats = await this.create({ _id: 'stats' });
    }
    
    // Calcular média de avaliações
    const feedbackStats = await Feedback.calculateAverageRating();
    
    // Atualizar estatísticas
    stats.averageRating = feedbackStats.averageRating;
    stats.feedbackCount = feedbackStats.feedbackCount;
    stats.lastUpdated = new Date();
    
    // Salvar atualizações
    await stats.save();
    
    logger.debug('Média de avaliações atualizada', {
      averageRating: stats.averageRating,
      feedbackCount: stats.feedbackCount
    });
    
    return stats;
  } catch (error) {
    logger.logDBError('updateAverageRating', error, 'Stats');
    throw error;
  }
};

// Criar modelo
const Stats = mongoose.model('Stats', statsSchema);

module.exports = Stats;