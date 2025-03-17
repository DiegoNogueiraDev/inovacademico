/**
 * File: inovacademico/backend/src/services/openRouterService.js
 * Service for interacting with the OpenRouter API
 */
const axios = require('axios');
const https = require('https');
const { config } = require('../config/env');
const referenceRepository = require('../repositories/referenceRepository');
const logger = require('../utils/logger');
const PromptLog = require('../models/PromptLog');

class OpenRouterService {
  constructor() {
    // Usar a URL do arquivo de configuração
    this.apiUrl = config.OPENROUTER_API_URL;
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
    
    // Log de inicialização
    logger.info('Serviço OpenRouter inicializado', { 
      apiUrl: this.apiUrl,
      model: this.modelName 
    });
  }

  /**
   * Busca referências relevantes do banco de dados com base no estilo e no conteúdo
   * @param {string} style - Estilo de citação (ex.: abnt, apa, vancouver, mla)
   * @param {string} content - Conteúdo da bibliografia para identificar referências similares
   * @param {number} limit - Número máximo de referências a retornar
   * @returns {Promise<Array>} - Array de referências encontradas
   */
  async getRelevantReferences(style, content, limit = 5) {
    try {
      // Busca referências do estilo especificado
      const references = await referenceRepository.findReferences({
        style,
        limit
      });
      
      return references || [];
    } catch (error) {
      console.error('Erro ao buscar referências:', error);
      return []; // Em caso de erro, retorna array vazio
    }
  }

  /**
   * Formata as referências para inclusão no prompt
   * @param {Array} references - Lista de referências a serem formatadas
   * @returns {string} - Texto formatado com exemplos de referências
   */
  formatReferencesForPrompt(references) {
    if (!references || references.length === 0) {
      return '';
    }

    let formattedText = 'Aqui estão alguns exemplos de referências bem formatadas que você pode usar como modelo:\n\n';
    
    references.forEach((ref, index) => {
      formattedText += `Exemplo ${index + 1}: ${ref.formatted || ref.title}\n`;
    });

    return formattedText + '\n';
  }

  /**
   * Salva um log do prompt enviado e resposta recebida
   * @param {Object} logData - Dados do prompt a serem salvos
   * @returns {Promise<Object>} - Documento salvo ou null em caso de erro
   */
  async savePromptLog(logData) {
    try {
      return await PromptLog.savePromptLog(logData);
    } catch (error) {
      logger.error('Erro ao salvar log do prompt', { error: error.message });
      return null; // Não queremos que falhas no log interrompam o fluxo principal
    }
  }

  /**
   * Faz uma requisição à API do OpenRouter para corrigir uma bibliografia
   * @param {string} bibliography - Texto da bibliografia a ser corrigida
   * @param {string} style - Estilo de citação (ex.: abnt, apa, vancouver, mla)
   * @param {Object} req - Objeto de requisição express (opcional)
   * @returns {Promise<string>} - Texto corrigido da bibliografia
   */
  async correctBibliography(bibliography, style = 'abnt', req = null) {
    const startTime = Date.now();
    let promptLogData = {
      provider: 'openrouter',
      model: this.modelName,
      style,
      originalLength: bibliography.length,
      ipAddress: req?.ip,
      userAgent: req?.headers?.['user-agent'],
      success: false,
    };

    try {
      const styleMap = {
        abnt: 'normas ABNT (Associação Brasileira de Normas Técnicas)',
        apa: 'normas APA (American Psychological Association)',
        vancouver: 'estilo Vancouver',
        mla: 'normas MLA (Modern Language Association)'
      };

      const styleText = styleMap[style] || styleMap.abnt;

      // Buscar referências relevantes do banco de dados
      const relevantReferences = await this.getRelevantReferences(style, bibliography);
      const referencesExamples = this.formatReferencesForPrompt(relevantReferences);

      const systemPrompt = `Você é um especialista em formatação de referências bibliográficas acadêmicas.
Sua tarefa é corrigir bibliografias conforme normas específicas.
Você deve retornar apenas o texto corrigido, sem explicações adicionais.`;

      let userPrompt = `Corrija a seguinte bibliografia conforme as ${styleText}. 
Mantenha a formatação exatamente de acordo com o padrão ${style.toUpperCase()}, 
incluindo espaçamento, itálico, negrito, pontuação e ordenação adequada.
Não acrescente explicações, apenas retorne o texto corrigido.`;

      // Adiciona exemplos de referências se existirem
      if (referencesExamples) {
        userPrompt += `\n\n${referencesExamples}`;
        logger.info(`Adicionadas ${relevantReferences.length} referências de exemplo ao prompt`);
      }

      userPrompt += `\nBibliografia:
${bibliography}`;

      // Salvar informações do prompt
      promptLogData.system = systemPrompt;
      promptLogData.user = userPrompt;

      // Mescla os cabeçalhos padrão com os extra headers opcionais
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...this.extraHeaders
      };

      logger.debug('Enviando requisição para OpenRouter API', { 
        url: this.apiUrl,
        model: this.modelName,
        style
      });

      const payload = {
        model: this.modelName,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.2,
        max_tokens: 1000,
      };

      logger.debug('Payload da requisição preparado');

      const response = await axios.post(
        this.apiUrl,
        payload,
        {
          headers,
          httpsAgent: this.httpsAgent,
          timeout: 60000 // 60 segundos
        }
      );

      const responseTime = Date.now() - startTime;
      
      logger.info('Resposta recebida da OpenRouter API', {
        status: response.status,
        model: response.data?.model || 'desconhecido',
        responseTime
      });

      if (response.data && response.data.choices && response.data.choices[0]?.message?.content) {
        const correctedText = response.data.choices[0].message.content.trim();
        
        // Atualizar dados do log com a resposta
        promptLogData.success = true;
        promptLogData.response = correctedText;
        promptLogData.responseTime = responseTime;
        promptLogData.correctedLength = correctedText.length;
        
        // Salvar log assincronamente
        this.savePromptLog(promptLogData);
        
        return correctedText;
      } else {
        logger.error('Formato inesperado de resposta da OpenRouter API', { 
          data: response.data
        });
        
        // Atualizar dados do log com o erro
        promptLogData.success = false;
        promptLogData.response = JSON.stringify(response.data);
        promptLogData.responseTime = responseTime;
        
        // Salvar log assincronamente
        this.savePromptLog(promptLogData);
        
        throw new Error('Nenhuma resposta válida foi recebida do modelo de IA');
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      if (error.response) {
        logger.error('Erro na API do OpenRouter', {
          status: error.response.status,
          data: error.response.data
        });
        
        // Atualizar dados do log com o erro
        promptLogData.success = false;
        promptLogData.response = JSON.stringify(error.response.data);
        promptLogData.responseTime = responseTime;
      } else {
        logger.error('Erro ao chamar OpenRouter', {
          message: error.message
        });
        
        // Atualizar dados do log com o erro
        promptLogData.success = false;
        promptLogData.response = error.message;
        promptLogData.responseTime = responseTime;
      }
      
      // Salvar log assincronamente
      this.savePromptLog(promptLogData);
      
      throw new Error(`Falha na correção da bibliografia: ${error.message}`);
    }
  }
}

module.exports = new OpenRouterService();
