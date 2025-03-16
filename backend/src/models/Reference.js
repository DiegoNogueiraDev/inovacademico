/**
 * File: inovacademico/backend/src/models/Reference.js
 * Modelo para referências bibliográficas
 */
const mongoose = require('mongoose');
const logger = require('../utils/logger');

const referenceSchema = new mongoose.Schema({
  // Dados básicos da referência
  title: {
    type: String,
    required: [true, 'O título é obrigatório'],
    trim: true
  },
  authors: {
    type: String,
    trim: true
  },
  year: {
    type: String,
    trim: true
  },
  publisher: {
    type: String,
    trim: true
  },
  
  // Campos adicionais específicos por tipo
  journal: {
    type: String,
    trim: true
  },
  volume: {
    type: String,
    trim: true
  },
  issue: {
    type: String,
    trim: true
  },
  pages: {
    type: String,
    trim: true
  },
  doi: {
    type: String,
    trim: true
  },
  url: {
    type: String,
    trim: true
  },
  
  // Estilo da citação
  style: {
    type: String,
    enum: ['abnt', 'apa', 'vancouver', 'mla'],
    default: 'abnt'
  },
  
  // Campo para armazenar a referência formatada
  formattedReference: {
    type: String,
    trim: true
  },
  
  // Campos para controle
  isValid: {
    type: Boolean,
    default: true
  },
  validationErrors: [{
    field: String,
    message: String
  }],
  
  // Metadata
  accessCount: {
    type: Number,
    default: 0
  },
  tags: [String]
}, {
  timestamps: true
});

// Índices para otimizar busca
referenceSchema.index({ title: 'text', authors: 'text' });
referenceSchema.index({ style: 1 });
referenceSchema.index({ createdAt: -1 });

/**
 * Método estático para buscar referências por pesquisa de texto
 * @param {String} searchTerm - Termo de busca
 * @param {String} style - Estilo de referência (opcional)
 * @param {Number} limit - Limite de resultados
 * @returns {Promise<Array>} - Lista de referências encontradas
 */
referenceSchema.statics.searchReferences = async function(searchTerm, style, limit = 20) {
  try {
    logger.debug('Pesquisando referências', { searchTerm, style, limit });
    
    const query = {};
    
    // Adicionar filtro de texto se fornecido
    if (searchTerm && searchTerm.trim() !== '') {
      // Usar expressão regular para busca case insensitive
      const regex = new RegExp(searchTerm, 'i');
      query.$or = [
        { title: regex },
        { authors: regex }
      ];
    }
    
    // Adicionar filtro de estilo se fornecido
    if (style && style.trim() !== '') {
      query.style = style.toLowerCase();
    }
    
    const references = await this.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);
      
    logger.debug(`Encontradas ${references.length} referências`, { 
      searchTerm, 
      style
    });
    
    return references;
  } catch (error) {
    logger.logDBError('searchReferences', error, 'Reference');
    throw error;
  }
};

/**
 * Método estático para gerar referência formatada de acordo com estilo
 * @param {Object} reference - Dados da referência
 * @param {String} style - Estilo de formatação
 * @returns {String} - Referência formatada
 */
referenceSchema.statics.formatReference = function(reference, style) {
  try {
    // Formatação básica por estilo
    let formatted = '';
    style = style.toLowerCase();
    
    // Formatação ABNT
    if (style === 'abnt') {
      // Formatação básica ABNT
      // SOBRENOME, Nome. Título. Edição. Local: Editora, ano.
      formatted = reference.authors ? `${reference.authors}. ` : '';
      formatted += `${reference.title}. `;
      formatted += reference.publisher ? `${reference.publisher}, ` : '';
      formatted += reference.year ? `${reference.year}.` : '';
    } 
    // Formatação APA
    else if (style === 'apa') {
      // Formatação básica APA
      // Sobrenome, N. (Ano). Título. Local: Editora.
      formatted = reference.authors ? `${reference.authors} ` : '';
      formatted += reference.year ? `(${reference.year}). ` : '';
      formatted += `${reference.title}. `;
      formatted += reference.publisher ? `${reference.publisher}.` : '';
    }
    // Formatação Vancouver
    else if (style === 'vancouver') {
      // Formatação básica Vancouver
      // Sobrenome N. Título. Revista. Ano;volume(edição):páginas.
      formatted = reference.authors ? `${reference.authors}. ` : '';
      formatted += `${reference.title}. `;
      formatted += reference.journal ? `${reference.journal}. ` : '';
      formatted += reference.year ? `${reference.year}` : '';
      formatted += reference.volume ? `;${reference.volume}` : '';
      formatted += reference.issue ? `(${reference.issue})` : '';
      formatted += reference.pages ? `:${reference.pages}.` : '.';
    }
    // Formatação MLA
    else if (style === 'mla') {
      // Formatação básica MLA
      // Sobrenome, Nome. "Título." Editora, Ano.
      formatted = reference.authors ? `${reference.authors}. ` : '';
      formatted += `"${reference.title}." `;
      formatted += reference.publisher ? `${reference.publisher}, ` : '';
      formatted += reference.year ? `${reference.year}.` : '';
    }
    // Estilo não suportado
    else {
      formatted = `${reference.title} (${reference.authors}, ${reference.year})`;
    }
    
    return formatted.trim();
  } catch (error) {
    logger.error('Erro ao formatar referência', { error, reference, style });
    return reference.title || 'Referência inválida';
  }
};

// Middleware pre-save para gerar formatação automática
referenceSchema.pre('save', function(next) {
  // Gerar formatação se não existir
  if (!this.formattedReference && this.title) {
    this.formattedReference = this.constructor.formatReference(this, this.style);
  }
  next();
});

// Criar modelo
const Reference = mongoose.model('Reference', referenceSchema);

module.exports = Reference; 