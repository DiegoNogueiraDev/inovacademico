/**
 * File: inovacademico/frontend/src/utils/logger.js
 * Módulo de logging para aplicações frontend
 */
import { createConsola } from 'consola';
import axios from 'axios';

// Obter a URL da API das variáveis de ambiente
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Criação da instância do logger
const logger = createConsola({
  // Configuração do nível de log baseado no ambiente
  level: process.env.NODE_ENV === 'production' ? 3 : 5, // 3=info, 5=debug
  // Incluir timestamp nos logs
  formatOptions: {
    date: true,
    colors: true,
    compact: false
  }
});

// Adiciona um método para enviar logs críticos para o servidor
logger.remoteError = async (message, error = {}, metadata = {}) => {
  try {
    // Log local primeiro
    logger.error(message, error);
    
    // Se estivermos em um ambiente de cliente (navegador)
    if (typeof window !== 'undefined') {
      // Preparar dados para envio
      const errorData = {
        message,
        timestamp: new Date().toISOString(),
        userAgent: window.navigator.userAgent,
        url: window.location.href,
        stack: error.stack || '',
        name: error.name || 'Error',
        metadata
      };
      
      // Enviar para o servidor apenas se estiver em produção ou se forçado
      if (process.env.NODE_ENV === 'production' || metadata.force) {
        await axios.post(`${API_URL}/logs/client-error`, errorData);
      }
    }
  } catch (sendError) {
    // Se falhar ao enviar, registrar apenas localmente
    logger.error('Falha ao enviar log para o servidor:', sendError);
  }
};

// Capturar erros não tratados no navegador
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    logger.remoteError('Erro não tratado no navegador', {
      message: event.message,
      stack: event.error?.stack,
      name: event.error?.name
    }, { 
      source: event.filename,
      line: event.lineno,
      column: event.colno 
    });
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    logger.remoteError('Promessa rejeitada não tratada', {
      message: event.reason?.message || 'Rejeição sem mensagem',
      stack: event.reason?.stack,
      name: event.reason?.name || 'UnhandledRejection'
    });
  });
}

// Configuração para enviar logs de ações do usuário (para análise de comportamento)
logger.userAction = (action, details = {}) => {
  logger.info(`Ação do usuário: ${action}`, details);
  
  // Em produção, poderíamos enviar para serviço de analytics ou para o backend
  if (process.env.NODE_ENV === 'production') {
    // Implementação para enviar dados de analytics
    // Por exemplo, Google Analytics ou um endpoint personalizado
  }
};

// Ajustar niveis com nomes mais semânticos para compatibilidade
logger.trace = logger.debug;
logger.warn = logger.warning;
logger.fatal = (message, ...args) => logger.error(`[FATAL] ${message}`, ...args);

// Registrar inicialização da aplicação
logger.success('Logger inicializado com sucesso');

export default logger; 