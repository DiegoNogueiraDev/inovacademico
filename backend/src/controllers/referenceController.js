/**
 * File: inovacademico/backend/src/controllers/referenceController.js
 * Controller para gerenciamento de referências bibliográficas
 */
const Reference = require('../models/Reference');
const logger = require('../utils/logger');
const csv = require('csv-parser');
const { Readable } = require('stream');

/**
 * Controlador de referências bibliográficas
 */
const referenceController = {
  /**
   * Buscar lista de referências com filtros opcionais
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getReferences(req, res, next) {
    try {
      logger.debug('Buscando referências com filtros', { 
        query: req.query
      });
      
      // Aplicar filtros da query
      const filters = {};
      if (req.query.style) filters.style = req.query.style;
      if (req.query.search) {
        filters.$or = [
          { title: { $regex: req.query.search, $options: 'i' } },
          { authors: { $regex: req.query.search, $options: 'i' } }
        ];
      }
      
      // Paginação
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;
      
      // Buscar referências
      const references = await Reference.find(filters)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      
      // Contar total para paginação
      const total = await Reference.countDocuments(filters);
      
      logger.info(`Recuperadas ${references.length} referências`, { 
        total,
        page,
        limit
      });
      
      return res.status(200).json({
        success: true,
        data: references,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      logger.logDBError('find', error, 'Reference');
      next(error);
    }
  },
  
  /**
   * Buscar uma referência específica por ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getReferenceById(req, res, next) {
    try {
      const { id } = req.params;
      
      logger.debug('Buscando referência por ID', { id });
      
      const reference = await Reference.findById(id);
      
      if (!reference) {
        logger.warn('Referência não encontrada', { id });
        return res.status(404).json({
          success: false,
          message: 'Referência não encontrada'
        });
      }
      
      logger.debug('Referência recuperada com sucesso', { id });
      
      return res.status(200).json({
        success: true,
        data: reference
      });
    } catch (error) {
      logger.logDBError('findById', error, 'Reference');
      next(error);
    }
  },
  
  /**
   * Salvar novas referências bibliográficas
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async saveReferences(req, res, next) {
    try {
      const { references } = req.body;
      
      if (!references || !Array.isArray(references) || references.length === 0) {
        logger.warn('Tentativa de salvar referências com dados inválidos', { body: req.body });
        return res.status(400).json({
          success: false,
          message: 'O campo references deve ser um array não vazio'
        });
      }
      
      logger.info(`Salvando ${references.length} referências bibliográficas`);
      
      // Validar cada referência antes de salvar
      const validReferences = references.filter(ref => {
        return ref.title && ref.style;
      });
      
      if (validReferences.length === 0) {
        logger.warn('Nenhuma referência válida para salvar');
        return res.status(400).json({
          success: false,
          message: 'Nenhuma referência válida para salvar'
        });
      }
      
      // Salvar referências válidas
      const savedReferences = await Reference.insertMany(validReferences);
      
      logger.info(`${savedReferences.length} referências salvas com sucesso`);
      
      return res.status(201).json({
        success: true,
        message: `${savedReferences.length} referências salvas com sucesso`,
        data: savedReferences,
        stats: {
          received: references.length,
          valid: validReferences.length,
          saved: savedReferences.length
        }
      });
    } catch (error) {
      logger.logDBError('insertMany', error, 'Reference');
      next(error);
    }
  },
  
  /**
   * Atualizar uma referência existente
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async updateReference(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      logger.info('Atualizando referência', { id });
      
      // Verificar se a referência existe
      const reference = await Reference.findById(id);
      
      if (!reference) {
        logger.warn('Tentativa de atualizar referência inexistente', { id });
        return res.status(404).json({
          success: false,
          message: 'Referência não encontrada'
        });
      }
      
      // Atualizar dados
      const updatedReference = await Reference.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      
      logger.info('Referência atualizada com sucesso', { id });
      
      return res.status(200).json({
        success: true,
        data: updatedReference
      });
    } catch (error) {
      logger.logDBError('findByIdAndUpdate', error, 'Reference');
      next(error);
    }
  },
  
  /**
   * Remover uma referência existente
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async deleteReference(req, res, next) {
    try {
      const { id } = req.params;
      
      logger.info('Removendo referência', { id });
      
      // Verificar se a referência existe
      const reference = await Reference.findById(id);
      
      if (!reference) {
        logger.warn('Tentativa de remover referência inexistente', { id });
        return res.status(404).json({
          success: false,
          message: 'Referência não encontrada'
        });
      }
      
      // Remover referência
      await Reference.findByIdAndDelete(id);
      
      logger.info('Referência removida com sucesso', { id });
      
      return res.status(200).json({
        success: true,
        message: 'Referência removida com sucesso'
      });
    } catch (error) {
      logger.logDBError('findByIdAndDelete', error, 'Reference');
      next(error);
    }
  },
  
  /**
   * Upload e processamento de arquivo de referências
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async uploadReferences(req, res, next) {
    try {
      if (!req.file) {
        logger.warn('Tentativa de upload sem arquivo');
        return res.status(400).json({
          success: false,
          message: 'Nenhum arquivo enviado'
        });
      }
      
      const style = req.body.style || 'abnt';
      const formato = req.body.formato || 'auto';
      const preservarHTML = req.body.preservarHTML === 'true';
      
      logger.info('Processando arquivo de referências', {
        filename: req.file.originalname,
        size: req.file.size,
        style,
        formato,
        preservarHTML
      });
      
      // Verificar formato solicitado ou detectar pela extensão do arquivo
      let formatoDetectado = formato;
      if (formato === 'auto') {
        const fileExt = req.file.originalname.split('.').pop().toLowerCase();
        if (fileExt === 'csv') formatoDetectado = 'csv';
        else if (fileExt === 'json') formatoDetectado = 'json';
        else if (fileExt === 'bib') formatoDetectado = 'bibtex';
        else if (fileExt === 'ris') formatoDetectado = 'ris';
        else if (fileExt === 'html' || fileExt === 'htm') formatoDetectado = 'html';
        else formatoDetectado = 'plain'; // Default para txt e outros
      }
      
      logger.debug(`Formato detectado: ${formatoDetectado}`);
      
      // Processar o arquivo de acordo com o formato
      switch (formatoDetectado) {
        case 'csv':
          return processCSVReferences(req, res, next, style);
          
        case 'json':
          return processJSONReferences(req, res, next, style);
          
        case 'bibtex':
          return processBibTexReferences(req, res, next, style);
          
        case 'ris':
          return processRISReferences(req, res, next, style);
          
        case 'html':
          return processHTMLReferences(req, res, next, style, preservarHTML);
          
        case 'plain':
          return processPlainTextReferences(req, res, next, style, preservarHTML);
          
        default:
          logger.warn('Formato de arquivo não suportado', { formato: formatoDetectado });
          return res.status(400).json({
            success: false,
            message: `Formato de arquivo não suportado: ${formatoDetectado}. Formatos suportados: CSV, JSON, BibTeX, RIS, HTML e texto.`
          });
      }
    } catch (error) {
      logger.error('Erro ao processar upload de arquivo', { error });
      next(error);
    }
  },
  
  /**
   * Validar referência de acordo com norma específica
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async validateReference(req, res, next) {
    try {
      const { reference, style } = req.body;
      
      if (!reference) {
        logger.warn('Tentativa de validar referência sem dados');
        return res.status(400).json({
          success: false,
          message: 'Dados da referência são obrigatórios'
        });
      }
      
      if (!style) {
        logger.warn('Tentativa de validar referência sem especificar estilo');
        return res.status(400).json({
          success: false,
          message: 'O estilo de citação é obrigatório'
        });
      }
      
      logger.info('Validando referência bibliográfica', { style });
      
      // Verificar campos obrigatórios de acordo com o estilo
      const validationResult = await validateReferenceByStyle(reference, style);
      
      logger.debug('Resultado da validação', validationResult);
      
      return res.status(200).json({
        success: true,
        data: validationResult
      });
    } catch (error) {
      logger.error('Erro ao validar referência', { error });
      next(error);
    }
  },
  
  /**
   * Importar referências a partir de arquivo JSON
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async importReferencesFromJson(req, res, next) {
    try {
      const { references } = req.body;
      
      if (!references || !Array.isArray(references)) {
        logger.warn('Tentativa de importar JSON inválido', { body: req.body });
        return res.status(400).json({
          success: false,
          message: 'JSON inválido. Envie um array de referências.'
        });
      }
      
      logger.info(`Importando ${references.length} referências de JSON`);
      
      // Validar cada referência
      const validations = {
        valid: [],
        invalid: []
      };
      
      for (const ref of references) {
        if (isValidReference(ref)) {
          validations.valid.push(ref);
        } else {
          validations.invalid.push({
            reference: ref,
            reason: 'Campos obrigatórios faltando'
          });
        }
      }
      
      // Salvar referências válidas
      let savedReferences = [];
      
      if (validations.valid.length > 0) {
        savedReferences = await Reference.insertMany(validations.valid);
        logger.info(`${savedReferences.length} referências importadas com sucesso`);
      }
      
      return res.status(200).json({
        success: true,
        message: `${validations.valid.length} referências importadas com sucesso`,
        data: savedReferences,
        stats: {
          received: references.length,
          valid: validations.valid.length,
          invalid: validations.invalid.length,
          saved: savedReferences.length
        },
        invalidReferences: process.env.NODE_ENV === 'production' 
          ? validations.invalid.length 
          : validations.invalid
      });
    } catch (error) {
      logger.error('Erro ao importar referências de JSON', { error });
      next(error);
    }
  }
};

/**
 * Processa arquivos CSV e extrai referências
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @param {String} style - Estilo de citação (abnt, apa, etc)
 */
async function processCSVReferences(req, res, next, style) {
  try {
    const results = [];
    
    // Criar um stream a partir do buffer do arquivo
    const stream = Readable.from(req.file.buffer);
    
    // Processar CSV
    await new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve())
        .on('error', (error) => reject(error));
    });
    
    logger.debug(`CSV processado com ${results.length} entradas`);
    
    // Transformar dados CSV em referências
    const references = results.map(item => {
      return {
        title: item.title || item.titulo,
        authors: item.authors || item.autores,
        publisher: item.publisher || item.editora,
        year: item.year || item.ano,
        style,
        ...item // Incluir outros campos
      };
    }).filter(isValidReference);
    
    logger.info(`${references.length} referências válidas extraídas do CSV`);
    
    // Salvar referências
    const savedReferences = await Reference.insertMany(references);
    
    return res.status(200).json({
      success: true,
      message: `${savedReferences.length} referências importadas com sucesso`,
      stats: {
        received: results.length,
        valid: references.length,
        saved: savedReferences.length
      }
    });
  } catch (error) {
    logger.error('Erro ao processar arquivo CSV', { error });
    next(error);
  }
}

/**
 * Processa arquivos JSON de referências
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @param {String} style - Estilo de citação (abnt, apa, etc)
 */
async function processJSONReferences(req, res, next, style) {
  try {
    let references;
    
    try {
      // Converter buffer para string e parsear como JSON
      const jsonString = req.file.buffer.toString('utf8');
      references = JSON.parse(jsonString);
      
      // Garantir que é um array
      if (!Array.isArray(references)) {
        // Se for um objeto com propriedade que contém o array
        if (references && typeof references === 'object') {
          // Procurar por uma propriedade que seja um array
          const arrayProps = Object.keys(references).filter(key => 
            Array.isArray(references[key])
          );
          
          if (arrayProps.length > 0) {
            references = references[arrayProps[0]];
          } else {
            // Converter objeto único para array
            references = [references];
          }
        } else {
          throw new Error('JSON não contém um array de referências');
        }
      }
    } catch (error) {
      logger.error('Erro ao parsear JSON', { error });
      return res.status(400).json({
        success: false,
        message: 'Arquivo JSON inválido: ' + error.message
      });
    }
    
    logger.debug(`JSON processado com ${references.length} entradas`);
    
    // Adicionar estilo às referências se não especificado
    references = references.map(ref => {
      return { ...ref, style: ref.style || style };
    }).filter(isValidReference);
    
    logger.info(`${references.length} referências válidas extraídas do JSON`);
    
    // Salvar referências
    const savedReferences = await Reference.insertMany(references);
    
    return res.status(200).json({
      success: true,
      message: `${savedReferences.length} referências importadas com sucesso`,
      stats: {
        received: references.length,
        valid: references.length,
        saved: savedReferences.length
      }
    });
  } catch (error) {
    logger.error('Erro ao processar arquivo JSON', { error });
    next(error);
  }
}

/**
 * Verifica se uma referência contém os campos mínimos obrigatórios
 * @param {Object} reference - Objeto de referência
 * @returns {Boolean} - Se a referência é válida
 */
function isValidReference(reference) {
  // Validação básica: verificar se tem título pelo menos
  return (
    reference && 
    typeof reference === 'object' &&
    reference.title &&
    typeof reference.title === 'string' &&
    reference.title.trim() !== ''
  );
}

/**
 * Valida uma referência de acordo com o estilo bibliográfico
 * @param {Object} reference - Dados da referência
 * @param {String} style - Estilo de citação
 * @returns {Object} - Resultado da validação
 */
async function validateReferenceByStyle(reference, style) {
  // Campos obrigatórios por estilo
  const requiredFields = {
    abnt: ['title', 'authors', 'publisher', 'year'],
    apa: ['title', 'authors', 'year'],
    vancouver: ['title', 'authors', 'journal', 'year'],
    mla: ['title', 'authors', 'publisher', 'year']
  };
  
  // Se o estilo não for reconhecido, usar ABNT como padrão
  const fields = requiredFields[style.toLowerCase()] || requiredFields.abnt;
  
  // Verificar campos obrigatórios
  const missingFields = fields.filter(field => 
    !reference[field] || 
    (typeof reference[field] === 'string' && reference[field].trim() === '')
  );
  
  // Formatar feedback
  const valid = missingFields.length === 0;
  const errors = valid ? [] : missingFields.map(field => {
    return {
      field,
      message: `O campo ${field} é obrigatório para o estilo ${style}`
    };
  });
  
  // Verificar formato dos campos (implementação básica)
  const formatChecks = [];
  
  if (reference.year && !/^\d{4}$/.test(reference.year.toString())) {
    formatChecks.push({
      field: 'year',
      message: 'O ano deve estar no formato YYYY (4 dígitos)'
    });
  }
  
  return {
    valid: valid && formatChecks.length === 0,
    style,
    errors: [...errors, ...formatChecks],
    reference
  };
}

/**
 * Processa arquivos HTML e extrai referências
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @param {String} style - Estilo de citação (abnt, apa, etc)
 * @param {Boolean} preservarHTML - Se deve preservar formatação HTML
 */
async function processHTMLReferences(req, res, next, style, preservarHTML) {
  try {
    // Converter buffer para string
    const htmlString = req.file.buffer.toString('utf8');
    
    logger.debug('Processando conteúdo HTML');
    
    // Extrair referências do HTML - cada <p> é considerado uma referência
    const references = [];
    
    // Extrair parágrafos usando regex simples
    const paragraphs = htmlString.match(/<p>.*?<\/p>/gs) || [];
    
    for (const paragraph of paragraphs) {
      // Remover tags <p> e </p>
      let cleanContent = paragraph.replace(/<p>/g, '').replace(/<\/p>/g, '');
      
      // Criar referência básica
      const reference = {
        style,
        title: cleanContent,
        formattedReference: preservarHTML ? paragraph : cleanContent,
        importSource: 'html'
      };
      
      references.push(reference);
    }
    
    logger.info(`${references.length} referências extraídas do HTML`);
    
    // Salvar referências
    if (references.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Nenhuma referência encontrada no arquivo HTML',
        stats: {
          received: 0,
          valid: 0,
          saved: 0
        }
      });
    }
    
    const savedReferences = await Reference.insertMany(references);
    
    return res.status(200).json({
      success: true,
      message: `${savedReferences.length} referências importadas com sucesso`,
      stats: {
        received: references.length,
        valid: references.length,
        saved: savedReferences.length
      }
    });
  } catch (error) {
    logger.error('Erro ao processar arquivo HTML', { error });
    next(error);
  }
}

/**
 * Processa arquivos BibTeX e extrai referências
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @param {String} style - Estilo de citação (abnt, apa, etc)
 */
async function processBibTexReferences(req, res, next, style) {
  try {
    // Converter buffer para string
    const bibtexString = req.file.buffer.toString('utf8');
    
    logger.debug('Processando conteúdo BibTeX');
    
    // Implementação básica para extrair entradas BibTeX
    const references = [];
    
    // Extrair entradas usando regex
    const entryPattern = /@(\w+)\s*\{\s*([^,]*),\s*([\s\S]*?)\}/g;
    let match;
    
    while ((match = entryPattern.exec(bibtexString)) !== null) {
      const entryType = match[1].toLowerCase(); // article, book, etc.
      const citeKey = match[2].trim();
      const entryContent = match[3];
      
      // Extrair campos
      const fields = {};
      const fieldPattern = /(\w+)\s*=\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g;
      let fieldMatch;
      
      while ((fieldMatch = fieldPattern.exec(entryContent)) !== null) {
        fields[fieldMatch[1].toLowerCase()] = fieldMatch[2].trim();
      }
      
      // Criar referência
      const reference = {
        style,
        type: mapBibTexTypeToReferenceType(entryType),
        title: fields.title || 'Sem título',
        authors: fields.author || fields.editor || '',
        year: fields.year || '',
        publisher: fields.publisher || '',
        journal: fields.journal || '',
        volume: fields.volume || '',
        issue: fields.number || '',
        pages: fields.pages || '',
        importSource: 'bibtex',
        sourceKey: citeKey
      };
      
      references.push(reference);
    }
    
    logger.info(`${references.length} referências extraídas do BibTeX`);
    
    // Salvar referências
    if (references.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Nenhuma referência encontrada no arquivo BibTeX',
        stats: {
          received: 0,
          valid: 0,
          saved: 0
        }
      });
    }
    
    const savedReferences = await Reference.insertMany(references);
    
    return res.status(200).json({
      success: true,
      message: `${savedReferences.length} referências importadas com sucesso`,
      stats: {
        received: references.length,
        valid: references.length,
        saved: savedReferences.length
      }
    });
  } catch (error) {
    logger.error('Erro ao processar arquivo BibTeX', { error });
    next(error);
  }
}

/**
 * Processa arquivos RIS e extrai referências
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @param {String} style - Estilo de citação (abnt, apa, etc)
 */
async function processRISReferences(req, res, next, style) {
  try {
    // Converter buffer para string
    const risString = req.file.buffer.toString('utf8');
    
    logger.debug('Processando conteúdo RIS');
    
    // Implementação básica para extrair entradas RIS
    const references = [];
    let currentReference = null;
    
    // Separar por linhas
    const lines = risString.split(/\r?\n/);
    
    for (const line of lines) {
      // Ignorar linhas vazias
      if (!line.trim()) continue;
      
      // Verificar formato TAG  - CONTEÚDO
      const match = line.match(/^([A-Z][A-Z0-9])  - (.*)$/);
      if (!match) continue;
      
      const [, tag, content] = match;
      
      // Iniciar nova referência quando encontrar tipo
      if (tag === 'TY') {
        if (currentReference) {
          references.push(currentReference);
        }
        currentReference = {
          style,
          type: mapRISTypeToReferenceType(content),
          importSource: 'ris'
        };
      }
      // Final da referência
      else if (tag === 'ER') {
        if (currentReference) {
          references.push(currentReference);
          currentReference = null;
        }
      }
      // Outros campos
      else if (currentReference) {
        switch (tag) {
          case 'TI': // Título
            currentReference.title = content;
            break;
          case 'AU': // Autor
            if (!currentReference.authors) {
              currentReference.authors = content;
            } else {
              currentReference.authors += '; ' + content;
            }
            break;
          case 'PY': // Ano
          case 'Y1':
            currentReference.year = content.replace(/\/.*$/, '');
            break;
          case 'PB': // Editora
            currentReference.publisher = content;
            break;
          case 'JO': // Journal
          case 'JF':
          case 'JA':
            currentReference.journal = content;
            break;
          case 'VL': // Volume
            currentReference.volume = content;
            break;
          case 'IS': // Issue
            currentReference.issue = content;
            break;
          case 'SP': // Start page
            if (!currentReference.pages) {
              currentReference.pages = content;
            } else {
              currentReference.pages = content + '-' + currentReference.pages;
            }
            break;
          case 'EP': // End page
            if (!currentReference.pages) {
              currentReference.pages = '-' + content;
            } else {
              currentReference.pages = currentReference.pages.replace(/-.*$/, '-' + content);
            }
            break;
        }
      }
    }
    
    // Adicionar última referência se existir
    if (currentReference) {
      references.push(currentReference);
    }
    
    logger.info(`${references.length} referências extraídas do RIS`);
    
    // Salvar referências
    if (references.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Nenhuma referência encontrada no arquivo RIS',
        stats: {
          received: 0,
          valid: 0,
          saved: 0
        }
      });
    }
    
    const savedReferences = await Reference.insertMany(references);
    
    return res.status(200).json({
      success: true,
      message: `${savedReferences.length} referências importadas com sucesso`,
      stats: {
        received: references.length,
        valid: references.length,
        saved: savedReferences.length
      }
    });
  } catch (error) {
    logger.error('Erro ao processar arquivo RIS', { error });
    next(error);
  }
}

/**
 * Processa arquivos de texto plano e extrai referências
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @param {String} style - Estilo de citação (abnt, apa, etc)
 * @param {Boolean} preservarHTML - Se deve preservar formatação HTML
 */
async function processPlainTextReferences(req, res, next, style, preservarHTML) {
  try {
    // Converter buffer para string
    const textString = req.file.buffer.toString('utf8');
    
    logger.debug('Processando conteúdo de texto plano');
    
    // Separar por linhas vazias ou linhas com apenas espaços
    const referenceTexts = textString.split(/\n\s*\n/).filter(text => text.trim() !== '');
    
    const references = referenceTexts.map(text => {
      return {
        style,
        title: text.trim(),
        importSource: 'plaintext',
        formattedReference: preservarHTML ? `<p>${text.trim()}</p>` : text.trim()
      };
    });
    
    logger.info(`${references.length} referências extraídas do texto plano`);
    
    // Salvar referências
    if (references.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Nenhuma referência encontrada no arquivo de texto',
        stats: {
          received: 0,
          valid: 0,
          saved: 0
        }
      });
    }
    
    const savedReferences = await Reference.insertMany(references);
    
    return res.status(200).json({
      success: true,
      message: `${savedReferences.length} referências importadas com sucesso`,
      stats: {
        received: references.length,
        valid: references.length,
        saved: savedReferences.length
      }
    });
  } catch (error) {
    logger.error('Erro ao processar arquivo de texto plano', { error });
    next(error);
  }
}

/**
 * Mapeia tipos BibTeX para tipos internos de referência
 * @param {String} bibtexType - Tipo do BibTeX
 * @returns {String} - Tipo interno de referência
 */
function mapBibTexTypeToReferenceType(bibtexType) {
  const typeMapping = {
    'article': 'artigo',
    'book': 'livro',
    'booklet': 'livro',
    'inbook': 'livro',
    'incollection': 'livro',
    'inproceedings': 'conferencia',
    'conference': 'conferencia',
    'manual': 'manual',
    'mastersthesis': 'dissertacao',
    'phdthesis': 'dissertacao',
    'proceedings': 'conferencia',
    'techreport': 'relatorio',
    'unpublished': 'outro',
    'misc': 'outro'
  };
  
  return typeMapping[bibtexType.toLowerCase()] || 'outro';
}

/**
 * Mapeia tipos RIS para tipos internos de referência
 * @param {String} risType - Tipo do RIS
 * @returns {String} - Tipo interno de referência
 */
function mapRISTypeToReferenceType(risType) {
  const typeMapping = {
    'JOUR': 'artigo',
    'JFULL': 'artigo',
    'BOOK': 'livro',
    'CHAP': 'livro',
    'CONF': 'conferencia',
    'CPAPER': 'conferencia',
    'THES': 'dissertacao',
    'RPRT': 'relatorio',
    'ELEC': 'site',
    'ICOMM': 'site',
    'GEN': 'outro',
    'UNPB': 'outro'
  };
  
  return typeMapping[risType] || 'outro';
}

module.exports = referenceController; 