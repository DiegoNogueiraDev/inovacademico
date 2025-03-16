/**
 * File: inovacademico/backend/src/models/Feedback.js
 * Modelo para armazenar feedback dos usuários
 */
const mongoose = require('mongoose');
const logger = require('../utils/logger');

const feedbackSchema = new mongoose.Schema({
  // Avaliação (1-5 estrelas)
  rating: {
    type: Number,
    required: [true, 'A avaliação é obrigatória'],
    min: [1, 'A avaliação mínima é 1'],
    max: [5, 'A avaliação máxima é 5']
  },
  
  // Comentário opcional
  comment: {
    type: String,
    trim: true
  },
  
  // Conteúdos da correção
  original: {
    type: String
  },
  corrected: {
    type: String
  },
  
  // Dados para análise e prevenção de spam
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
}, {
  timestamps: true
});

// Método estático para calcular média de avaliações
feedbackSchema.statics.calculateAverageRating = async function() {
  try {
    logger.debug('Calculando média de avaliações');
    
    const result = await this.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    const averageRating = result.length > 0 ? result[0].avgRating : 0;
    const feedbackCount = result.length > 0 ? result[0].count : 0;
    
    logger.debug('Média de avaliações calculada', { 
      averageRating,
      feedbackCount
    });
    
    return {
      averageRating: parseFloat(averageRating.toFixed(1)),
      feedbackCount
    };
  } catch (error) {
    logger.logDBError('calculateAverageRating', error, 'Feedback');
    throw error;
  }
};

// Método estático para obter distribuição de avaliações
feedbackSchema.statics.getRatingDistribution = async function() {
  try {
    logger.debug('Obtendo distribuição de avaliações');
    
    const result = await this.aggregate([
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    // Formatar resultado
    const distribution = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    };
    
    result.forEach(item => {
      distribution[item._id] = item.count;
    });
    
    logger.debug('Distribuição de avaliações obtida', { distribution });
    
    return distribution;
  } catch (error) {
    logger.logDBError('getRatingDistribution', error, 'Feedback');
    throw error;
  }
};

// Método para obter estatísticas completas de feedback
feedbackSchema.statics.getFeedbackStats = async function() {
  try {
    logger.debug('Obtendo estatísticas completas de feedback');
    
    const averageData = await this.calculateAverageRating();
    const distribution = await this.getRatingDistribution();
    
    // Calcular estatísticas adicionais
    const recentFeedbacks = await this.find()
      .select('rating comment createdAt')
      .sort({ createdAt: -1 })
      .limit(5);
    
    logger.debug('Estatísticas de feedback obtidas com sucesso');
    
    return {
      averageRating: averageData.averageRating,
      feedbackCount: averageData.feedbackCount,
      distribution,
      recentFeedbacks
    };
  } catch (error) {
    logger.logDBError('getFeedbackStats', error, 'Feedback');
    throw error;
  }
};

// Criar modelo
const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback; 