/**
 * File: inovacademico/backend/src/models/PromptLog.js
 * Modelo para armazenar logs dos prompts enviados à API de IA
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const promptLogSchema = new Schema({
  // Dados do prompt
  system: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  
  // Metadados da requisição
  provider: {
    type: String,
    enum: ['openrouter', 'openai'],
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  style: {
    type: String,
    enum: ['abnt', 'apa', 'vancouver', 'mla'],
    required: true,
  },
  
  // Dados da resposta
  response: {
    type: String,
  },
  responseTime: {
    type: Number, // em milissegundos
  },
  success: {
    type: Boolean,
    default: false,
  },
  
  // Metadados adicionais
  ipAddress: String,
  userAgent: String,
  
  // Campos para análise
  originalLength: Number,
  correctedLength: Number,
  
  // Campos para auditoria
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Método estático para salvar log de prompt
promptLogSchema.statics.savePromptLog = async function(data) {
  try {
    const promptLog = new this(data);
    return await promptLog.save();
  } catch (error) {
    console.error('Erro ao salvar log de prompt:', error);
    // Não queremos que falhas no log interrompam o fluxo principal
    return null;
  }
};

// Método estático para obter estatísticas de prompts
promptLogSchema.statics.getPromptStats = async function() {
  try {
    const totalCount = await this.countDocuments();
    const successCount = await this.countDocuments({ success: true });
    const averageResponseTime = await this.aggregate([
      { $match: { success: true } },
      { $group: { _id: null, avg: { $avg: '$responseTime' } } }
    ]);
    
    const providerStats = await this.aggregate([
      { $group: { _id: '$provider', count: { $sum: 1 } } }
    ]);
    
    const styleStats = await this.aggregate([
      { $group: { _id: '$style', count: { $sum: 1 } } }
    ]);
    
    return {
      totalCount,
      successCount,
      successRate: totalCount ? (successCount / totalCount * 100).toFixed(2) : 0,
      averageResponseTime: averageResponseTime.length ? Math.round(averageResponseTime[0].avg) : 0,
      providerStats: providerStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      styleStats: styleStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {})
    };
  } catch (error) {
    console.error('Erro ao obter estatísticas de prompts:', error);
    return {
      totalCount: 0,
      successCount: 0,
      successRate: 0,
      averageResponseTime: 0,
      providerStats: {},
      styleStats: {}
    };
  }
};

const PromptLog = mongoose.model('PromptLog', promptLogSchema);

module.exports = PromptLog; 