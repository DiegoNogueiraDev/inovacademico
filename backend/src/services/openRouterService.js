/**
 * File: inovacademico/backend/src/services/openRouterService.js
 * Service for interacting with the OpenRouter API
 */
const axios = require('axios');
const https = require('https');
const { config } = require('../config/env');

class OpenRouterService {
  constructor() {
    // A URL correta para API de chat completions
    this.apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
    this.apiKey = config.OPENROUTER_API_KEY;
    this.modelName = config.MODEL_NAME;
    this.extraHeaders = {
      'HTTP-Referer': config.FRONTEND_URL,
      'X-Title': config.SITE_NAME || 'InovAcademico API'
    };
    // Cria um agente HTTPS que ignora a verificação do certificado
    this.httpsAgent = new https.Agent({
      rejectUnauthorized: false
    });
  }

  /**
   * Faz uma requisição à API do OpenRouter para corrigir uma bibliografia
   * @param {string} bibliography - Texto da bibliografia a ser corrigida
   * @param {string} style - Estilo de citação (ex.: abnt, apa, vancouver, mla)
   * @returns {Promise<string>} - Texto corrigido da bibliografia
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

      const systemPrompt = `Você é um especialista em formatação de referências bibliográficas acadêmicas.
Sua tarefa é corrigir bibliografias conforme normas específicas.
Você deve retornar apenas o texto corrigido, sem explicações adicionais.`;

      const userPrompt = `Corrija a seguinte bibliografia conforme as ${styleText}. 
Mantenha a formatação exatamente de acordo com o padrão ${style.toUpperCase()}, 
incluindo espaçamento, itálico, negrito, pontuação e ordenação adequada.
Não acrescente explicações, apenas retorne o texto corrigido.

Bibliografia:
${bibliography}`;

      // Mescla os cabeçalhos padrão com os extra headers opcionais
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...this.extraHeaders
      };

      console.log('Enviando requisição para OpenRouter API:', this.apiUrl);

      const payload = {
        model: this.modelName,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.2,
        max_tokens: 1000,
      };

      console.log('Payload da requisição:', JSON.stringify(payload, null, 2));

      const response = await axios.post(
        this.apiUrl,
        payload,
        {
          headers,
          httpsAgent: this.httpsAgent,
          timeout: 60000 // 60 segundos
        }
      );

      console.log('Resposta recebida da OpenRouter API');

      if (response.data && response.data.choices && response.data.choices[0]?.message?.content) {
        return response.data.choices[0].message.content.trim();
      } else {
        console.error('Formato inesperado de resposta da OpenRouter API:', 
          JSON.stringify(response.data, null, 2));
        throw new Error('Nenhuma resposta válida foi recebida do modelo de IA');
      }
    } catch (error) {
      console.error('Error in OpenRouter service:', 
        error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
      throw new Error(`Falha na correção da bibliografia: ${error.message}`);
    }
  }
}

module.exports = new OpenRouterService();
