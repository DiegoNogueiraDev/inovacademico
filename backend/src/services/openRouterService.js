/**
 * File: inovacademico/backend/src/services/openRouterService.js
 * Service for interacting with the OpenRouter API
 */
const axios = require('axios');
const { config } = require('../config/env');

/**
 * Service for interacting with the OpenRouter API
 */
class OpenRouterService {
  constructor() {
    this.apiUrl = config.OPENROUTER_API_URL;
    this.apiKey = config.OPENROUTER_API_KEY;
    this.modelName = config.MODEL_NAME;
  }

  /**
   * Make a request to the OpenRouter API to correct bibliography
   * @param {string} bibliography - The bibliography text to correct
   * @param {string} style - The citation style to use (abnt, apa, etc.)
   * @returns {Promise<string>} - The corrected bibliography text
   */
  async correctBibliography(bibliography, style = 'abnt') {
    try {
      const styleMap = {
        abnt: 'normas ABNT (Associação Brasileira de Normas Técnicas)',
        apa: 'normas APA (American Psychological Association)',
        vancouver: 'estilo Vancouver',
        mla: 'normas MLA (Modern Language Association)'
      };
      
      const styleText = styleMap[style] || styleMap.abnt;
      
      const prompt = `Corrija a seguinte bibliografia conforme as ${styleText}. 
Mantenha a formatação exatamente de acordo com o padrão ${style.toUpperCase()}, 
incluindo espaçamento, itálico, negrito, pontuação e ordenação adequada.
Não acrescente explicações, apenas retorne o texto corrigido.

Bibliografia:
${bibliography}`;

      const response = await axios.post(
        this.apiUrl,
        {
          model: this.modelName,
          prompt,
          temperature: 0.2,
          max_tokens: 1000,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      );

      // Extract the corrected text from the response
      if (response.data && response.data.choices && response.data.choices[0]?.text) {
        return response.data.choices[0].text.trim();
      }
      
      throw new Error('No valid response received from AI model');
    } catch (error) {
      console.error('Error in OpenRouter service:', error.message);
      throw new Error(`Failed to correct bibliography: ${error.message}`);
    }
  }
}

module.exports = new OpenRouterService();