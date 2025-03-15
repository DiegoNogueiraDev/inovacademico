/**
 * File: inovacademico/frontend/src/services/apiService.js
 * Service for API calls to backend
 */
import axios from 'axios';

// Create an axios instance with a base URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const apiService = {
  /**
   * Send a request to correct a bibliography
   * @param {string} bibliography - The bibliography text to correct
   * @param {string} style - The citation style to use (abnt, apa, etc.)
   * @returns {Promise<Object>} - The correction response with original and corrected text
   */
  async correctBibliography(bibliography, style = 'abnt') {
    try {
      const response = await api.post('/bibliography/correct', { 
        bibliography,
        style
      });
      
      if (response.data && response.data.success) {
        return response.data.data;
      }
      
      throw new Error('Failed to correct bibliography');
    } catch (error) {
      console.error('API error:', error);
      
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
      const response = await api.post('/bibliography/feedback', feedback);
      
      if (response.data && response.data.success) {
        return response.data;
      }
      
      throw new Error('Failed to submit feedback');
    } catch (error) {
      console.error('API error when submitting feedback:', error);
      throw new Error('Erro ao enviar feedback');
    }
  },

  /**
   * Get application statistics
   * @returns {Promise<Object>} - The application statistics
   */
  async getStats() {
    try {
      const response = await api.get('/stats');
      
      if (response.data && response.data.success) {
        return response.data.data;
      }
      
      throw new Error('Failed to fetch statistics');
    } catch (error) {
      console.error('API error when fetching stats:', error);
      throw new Error('Erro ao carregar estatísticas');
    }
  },

  /**
   * Check API health
   * @returns {Promise<boolean>} - Whether the API is healthy
   */
  async checkHealth() {
    try {
      const response = await api.get('/');
      return response.status === 200;
    } catch (error) {
      console.error('API health check failed:', error);
      return false;
    }
  }
};

export default apiService;