/**
 * File: inovacademico/backend/src/services/openAIService.js
 * Serviço de integração com OpenAI para correção de bibliografia
 */
const axios = require('axios');
const logger = require('../utils/logger');

/**
 * Classe de serviço para interação com a API da OpenAI
 */
class OpenAIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
    this.baseURL = 'https://api.openai.com/v1/chat/completions';
    
    // Verificar se a chave da API está definida
    if (!this.apiKey) {
      logger.warn('API key da OpenAI não definida. O serviço de correção não funcionará.');
    } else {
      logger.info('Serviço OpenAI inicializado', { model: this.model });
    }
  }
  
  /**
   * Corrigir bibliografia de acordo com o estilo especificado
   * @param {String} bibliography - Texto da bibliografia a ser corrigido
   * @param {String} style - Estilo de citação (abnt, apa, mla, vancouver)
   * @returns {Promise<Object>} - Resultado da correção
   */
  async correctBibliography(bibliography, style) {
    try {
      if (!this.apiKey) {
        throw new Error('API key da OpenAI não configurada');
      }
      
      logger.debug('Enviando bibliografia para correção', { style, length: bibliography.length });
      
      // Construir prompt baseado no estilo
      const prompt = this.buildCorrectionPrompt(bibliography, style);
      
      // Chamar a API da OpenAI
      const response = await axios.post(
        this.baseURL,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: prompt.system
            },
            {
              role: 'user',
              content: prompt.user
            }
          ],
          temperature: 0.2, // Baixa temperatura para respostas mais consistentes
          max_tokens: 4000
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );
      
      // Registrar uso de tokens para monitoramento
      const { usage } = response.data;
      logger.info('Resposta da API da OpenAI recebida', {
        promptTokens: usage?.prompt_tokens,
        completionTokens: usage?.completion_tokens,
        totalTokens: usage?.total_tokens
      });
      
      // Processar resposta
      const aiResponse = response.data.choices[0].message.content;
      return this.processAIResponse(aiResponse, bibliography);
    } catch (error) {
      // Capturar e registrar erros específicos da API da OpenAI
      if (error.response) {
        logger.error('Erro na API da OpenAI', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      } else {
        logger.error('Erro ao chamar serviço de IA', {
          message: error.message,
          stack: error.stack
        });
      }
      
      throw new Error(`Erro no serviço de correção: ${error.message}`);
    }
  }
  
  /**
   * Construir prompt para correção de bibliografia
   * @param {String} bibliography - Texto da bibliografia
   * @param {String} style - Estilo de citação
   * @returns {Object} - Prompts para system e user
   */
  buildCorrectionPrompt(bibliography, style) {
    // Prompt base para o papel do sistema
    const systemPrompt = `Você é um assistente especializado em normas de citação bibliográfica, com foco especial no estilo ${style.toUpperCase()}. 
Sua tarefa é analisar e corrigir referências bibliográficas, garantindo que estejam em conformidade com as normas ${style.toUpperCase()}.

Ao corrigir as referências, você deve:
1. Manter a informação original, apenas ajustando o formato conforme as normas
2. Corrigir pontuação, itálicos (indicados entre asteriscos *texto em itálico*), e ordenação dos elementos
3. Não adicionar informações que não estejam presentes no texto original
4. Não remover informações importantes presentes no original

Para cada referência que você corrigir, indique as alterações realizadas de forma clara e didática.

Responda APENAS com o seguinte formato JSON:
{
  "corrected": "Texto completo corrigido da bibliografia",
  "changes": [
    {
      "original": "Referência original",
      "corrected": "Referência corrigida",
      "explanation": "Breve explicação das correções"
    }
  ]
}`;

    // Prompt específico para o usuário baseado no estilo
    let userPrompt = `Por favor, corrija a seguinte bibliografia de acordo com as normas ${style.toUpperCase()}:\n\n${bibliography}`;
    
    return {
      system: systemPrompt,
      user: userPrompt
    };
  }
  
  /**
   * Processar a resposta da API da OpenAI
   * @param {String} aiResponse - Resposta da API
   * @param {String} originalText - Texto original para fallback
   * @returns {Object} - Dados processados da correção
   */
  processAIResponse(aiResponse, originalText) {
    try {
      // Extrair o JSON da resposta
      let jsonMatch = aiResponse.match(/```json\n([\s\S]*)\n```/);
      
      // Se não encontrado no formato ```json, tentar encontrar apenas {}
      if (!jsonMatch) {
        jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      }
      
      let jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : aiResponse;
      
      // Parsear JSON
      const result = JSON.parse(jsonStr);
      
      // Validar os campos necessários
      if (!result.corrected) {
        logger.warn('Resposta da IA sem campo "corrected"', { response: aiResponse });
        result.corrected = originalText;
      }
      
      if (!result.changes || !Array.isArray(result.changes)) {
        logger.warn('Resposta da IA sem campo "changes" válido', { response: aiResponse });
        result.changes = [];
      }
      
      return result;
    } catch (error) {
      logger.error('Erro ao processar resposta da IA', { 
        error: error.message,
        response: aiResponse 
      });
      
      // Retornar um objeto com valores padrão em caso de falha
      return {
        corrected: originalText,
        changes: [],
        error: 'Não foi possível processar a correção'
      };
    }
  }
}

module.exports = new OpenAIService(); 