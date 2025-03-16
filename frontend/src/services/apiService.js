/**
 * File: inovacademico/frontend/src/services/apiService.js
 * Service for API calls to backend
 */
import axios from 'axios';
import logger from '../utils/logger';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Configurando axios para logging
axios.interceptors.request.use(
  (config) => {
    logger.debug(`Requisição para ${config.url}`, { 
      method: config.method?.toUpperCase(),
      baseURL: config.baseURL,
      url: config.url,
      params: config.params
    });
    return config;
  },
  (error) => {
    logger.error('Erro na requisição', error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    logger.debug(`Resposta de ${response.config.url}`, { 
      status: response.status,
      statusText: response.statusText
    });
    return response;
  },
  (error) => {
    // Formatar um erro mais informativo
    const errorInfo = {
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message
    };
    
    // Registrar erro com informações detalhadas
    logger.error(`Erro API: ${errorInfo.status || 'Rede'} em ${errorInfo.method} ${errorInfo.url}`, errorInfo);
    
    // Para erros de servidor (5xx), enviar para o backend
    if (error.response?.status >= 500) {
      logger.remoteError('Erro de servidor na API', error, errorInfo);
    }
    
    return Promise.reject(error);
  }
);

const apiService = {
  /**
   * Obter estatísticas de uso do sistema
   */
  getStats: async () => {
    try {
      logger.info('Buscando estatísticas do sistema');
      const response = await axios.get(`${API_URL}/stats`);
      logger.debug('Estatísticas recebidas', { data: response.data });
      return response.data.data;
    } catch (error) {
      logger.error('Erro ao buscar estatísticas:', error);
      throw error;
    }
  },

  /**
   * Salvar referências bibliográficas no banco de dados
   * @param {Array} references - Lista de referências a serem salvas
   */
  saveReferences: async (references) => {
    try {
      logger.info('Salvando referências bibliográficas', { count: references.length });
      const response = await axios.post(`${API_URL}/references`, { references });
      logger.debug('Referências salvas com sucesso', { data: response.data });
      return response.data;
    } catch (error) {
      logger.error('Erro ao salvar referências:', error);
      throw error;
    }
  },

  /**
   * Upload e processamento de arquivo de referências
   * @param {FormData} formData - Formulário contendo o arquivo e estilo de citação
   */
  uploadReferences: async (formData) => {
    try {
      logger.info('Enviando arquivo de referências');
      const response = await axios.post(`${API_URL}/references/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      logger.debug('Arquivo de referências processado com sucesso', { data: response.data });
      return response.data;
    } catch (error) {
      logger.error('Erro ao fazer upload de referências:', error);
      throw error;
    }
  },

  /**
   * Validar e importar referências de um arquivo JSON
   * @param {Array} jsonData - Array de objetos de referência no formato JSON
   * @returns {Promise<Object>} - Resultado da importação com contadores
   */
  validateAndImportJson: async (jsonData) => {
    try {
      logger.info('Importando referências do JSON', { count: jsonData.length });
      const response = await axios.post(`${API_URL}/references/import-json`, {
        references: jsonData
      });
      logger.debug('Referências importadas com sucesso', { data: response.data });
      return response.data;
    } catch (error) {
      logger.error('Erro ao importar JSON:', error);
      throw error;
    }
  },

  /**
   * Obter lista de referências salvas
   * @param {Object} filters - Filtros para busca (opcional)
   */
  getReferences: async (filters = {}) => {
    try {
      logger.info('Buscando referências', { filters });
      const response = await axios.get(`${API_URL}/references`, { params: filters });
      logger.debug('Referências recuperadas com sucesso', { count: response.data.data?.length });
      return response.data;
    } catch (error) {
      logger.error('Erro ao buscar referências:', error);
      throw error;
    }
  },

  /**
   * Validar referência bibliográfica de acordo com norma específica
   * @param {Object} reference - Dados da referência
   * @param {String} style - Estilo de citação (abnt, apa, vancouver, mla)
   */
  validateReference: async (reference, style) => {
    try {
      logger.info('Validando referência', { style });
      const response = await axios.post(`${API_URL}/references/validate`, {
        reference,
        style
      });
      logger.debug('Referência validada', { isValid: response.data.valid });
      return response.data;
    } catch (error) {
      logger.error('Erro ao validar referência:', error);
      throw error;
    }
  },

  /**
   * Send a request to correct a bibliography
   * @param {string} bibliography - The bibliography text to correct
   * @param {string} style - The citation style to use (abnt, apa, etc.)
   * @returns {Promise<Object>} - The correction response with original and corrected text
   */
  async correctBibliography(bibliography, style = 'abnt') {
    try {
      logger.info('Solicitando correção de bibliografia', { style, length: bibliography.length });
      
      const response = await axios.post(`${API_URL}/bibliography/correct`, { 
        bibliography,
        style
      });
      
      if (response.data && response.data.success) {
        logger.debug('Bibliografia corrigida com sucesso', { style });
        return response.data.data;
      }
      
      logger.warn('Falha na correção de bibliografia - sucesso:false', { response: response.data });
      throw new Error('Failed to correct bibliography');
    } catch (error) {
      logger.error('Erro na API de correção:', error);
      // Registrar para analytics de erros comuns
      logger.userAction('bibliography_correction_failed', { style });
      
      // Extract the most relevant error message
      const errorMessage = 
        error.response?.data?.message ||
        error.message ||
        'Erro ao conectar com o serviço';
        
      throw new Error(errorMessage);
    }
  },

  /**
   * Submit feedback about a correction
   * @param {Object} feedback - The feedback data
   * @param {number} feedback.rating - Rating from 1-5
   * @param {string} feedback.comment - Optional comment
   * @param {string} feedback.original - Original bibliography text
   * @param {string} feedback.corrected - Corrected bibliography text
   * @returns {Promise<Object>} - The feedback submission response
   */
  async submitFeedback(feedback) {
    try {
      logger.info('Enviando feedback de correção', { rating: feedback.rating });
      
      const response = await axios.post(`${API_URL}/bibliography/feedback`, feedback);
      
      if (response.data && response.data.success) {
        logger.userAction('feedback_submitted', { rating: feedback.rating });
        return response.data;
      }
      
      logger.warn('Falha ao enviar feedback - sucesso:false', { response: response.data });
      throw new Error('Failed to submit feedback');
    } catch (error) {
      logger.error('Erro na API ao enviar feedback:', error);
      throw new Error('Erro ao enviar feedback');
    }
  },

  /**
   * Check API health
   * @returns {Promise<boolean>} - Whether the API is healthy
   */
  async checkHealth() {
    try {
      logger.debug('Verificando saúde da API');
      const response = await axios.get(`${API_URL}/`);
      
      const isHealthy = response.status === 200;
      logger.debug('Status da API', { healthy: isHealthy, status: response.status });
      
      return isHealthy;
    } catch (error) {
      logger.error('Verificação de saúde da API falhou:', error);
      return false;
    }
  }
};

export default apiService;