/**
 * File: inovacademico/backend/src/repositories/referenceRepository.js
 * Repositório para acesso às referências bibliográficas no banco de dados
 */
const Reference = require('../models/Reference');
const logger = require('../utils/logger');

class ReferenceRepository {
  /**
   * Busca referências bibliográficas no banco de dados
   * @param {Object} options - Opções de busca
   * @param {string} options.style - Estilo de citação (abnt, apa, vancouver, mla)
   * @param {string} options.type - Tipo de referência (book, article, website, etc.)
   * @param {string} options.search - Termo de busca no título ou autores
   * @param {number} options.limit - Número máximo de referências a retornar
   * @param {number} options.skip - Número de referências a pular (para paginação)
   * @returns {Promise<Array>} - Array de referências encontradas
   */
  async findReferences(options = {}) {
    try {
      const { style, type, search, limit = 20, skip = 0 } = options;
      const query = {};

      // Filtros
      if (style) {
        // Aceitar múltiplos estilos separados por vírgula
        const styles = style.split(',');
        if (styles.length > 1) {
          query.style = { $in: styles };
        } else {
          query.style = style;
        }
      }

      if (type) {
        // Aceitar múltiplos tipos separados por vírgula
        const types = type.split(',');
        if (types.length > 1) {
          query.type = { $in: types };
        } else {
          query.type = type;
        }
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { authors: { $regex: search, $options: 'i' } }
        ];
      }

      // Buscar no banco de dados usando o modelo Mongoose
      const references = await Reference.find(query)
        .sort({ createdAt: -1 }) // Mais recentes primeiro
        .skip(skip)
        .limit(limit);

      logger.debug(`Encontradas ${references.length} referências`, { 
        style, type, search, limit 
      });

      return references;
    } catch (error) {
      logger.error('Erro ao buscar referências:', error);
      throw error;
    }
  }

  /**
   * Salva uma ou mais referências no banco de dados
   * @param {Array|Object} references - Lista de referências ou uma única referência
   * @returns {Promise<Object>} - Resultado da operação
   */
  async saveReferences(references) {
    try {
      // Garantir que estamos lidando com um array
      const referencesArray = Array.isArray(references) ? references : [references];
      
      // Inserir usando Mongoose
      const result = await Reference.insertMany(referencesArray);
      
      logger.info(`${result.length} referências salvas com sucesso`);
      
      return {
        success: true,
        inserted: result.length,
        references: result
      };
    } catch (error) {
      logger.error('Erro ao salvar referências:', error);
      throw error;
    }
  }

  /**
   * Valida e importa referências de um arquivo JSON
   * @param {Array} references - Lista de referências a serem importadas
   * @returns {Promise<Object>} - Resultado da operação com contadores
   */
  async validateAndImportJson(references) {
    try {
      const validReferences = [];
      const rejectedReferences = [];

      // Validar cada referência
      for (const ref of references) {
        // Verificar campos obrigatórios comuns
        if (!ref.title) {
          rejectedReferences.push({...ref, reason: 'Título ausente'});
          continue;
        }

        if (!ref.style || !['abnt', 'apa', 'vancouver', 'mla'].includes(ref.style)) {
          rejectedReferences.push({...ref, reason: 'Estilo inválido ou ausente'});
          continue;
        }

        // Validações por estilo
        if (ref.style === 'abnt' && (!ref.authors || !ref.year)) {
          rejectedReferences.push({...ref, reason: 'Campos obrigatórios para ABNT ausentes'});
          continue;
        }

        if (ref.style === 'apa' && (!ref.authors || !ref.year)) {
          rejectedReferences.push({...ref, reason: 'Campos obrigatórios para APA ausentes'});
          continue;
        }

        if (ref.style === 'vancouver' && (!ref.authors || !ref.year)) {
          rejectedReferences.push({...ref, reason: 'Campos obrigatórios para Vancouver ausentes'});
          continue;
        }

        if (ref.style === 'mla' && (!ref.authors || !ref.year)) {
          rejectedReferences.push({...ref, reason: 'Campos obrigatórios para MLA ausentes'});
          continue;
        }

        // Se passar por todas as validações, adicionar à lista de válidas
        validReferences.push(ref);
      }

      // Salvar referências válidas no banco de dados
      let result = { imported: 0, rejected: rejectedReferences.length };
      
      if (validReferences.length > 0) {
        const saveResult = await this.saveReferences(validReferences);
        result.imported = saveResult.inserted;
      }

      logger.info(`Importação JSON: ${result.imported} referências importadas, ${result.rejected} rejeitadas`);
      
      return result;
    } catch (error) {
      logger.error('Erro ao importar referências do JSON:', error);
      throw error;
    }
  }

  /**
   * Busca uma referência pelo ID
   * @param {string} id - ID da referência
   * @returns {Promise<Object>} - Referência encontrada
   */
  async findById(id) {
    try {
      return await Reference.findById(id);
    } catch (error) {
      logger.error('Erro ao buscar referência por ID:', error);
      throw error;
    }
  }
}

module.exports = new ReferenceRepository(); 