/**
 * File: inovacademico/backend/src/utils/logger.js
 * Módulo de logging para aplicações backend
 */
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');
const fs = require('fs');

// Criando diretório de logs se não existir
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Definição de formatos personalizados
const { combine, timestamp, printf, colorize, errors } = winston.format;

// Formato de data personalizado
const timestampFormat = timestamp({
  format: 'YYYY-MM-DD HH:mm:ss.SSS'
});

// Formato de impressão de logs
const logFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
  // Formatação de metadados para melhor legibilidade
  let meta = '';
  if (Object.keys(metadata).length > 0) {
    meta = JSON.stringify(metadata);
  }
  
  // Se houver stack trace, inclui ele no log
  return stack
    ? `${timestamp} ${level}: ${message}\n${stack}${meta ? ' ' + meta : ''}`
    : `${timestamp} ${level}: ${message}${meta ? ' ' + meta : ''}`;
});

// Configuração de transporte para arquivo de logs diário com rotação
const fileRotateTransport = new DailyRotateFile({
  filename: path.join(logDir, 'inovacademico-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m', // Tamanho máximo de 20MB por arquivo
  maxFiles: '14d', // Manter logs por 14 dias
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
});

// Configuração de transporte para logs de erro em arquivo separado
const errorFileRotateTransport = new DailyRotateFile({
  filename: path.join(logDir, 'inovacademico-error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '30d', // Manter logs de erro por 30 dias
  level: 'error'
});

// Criando a instância do logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestampFormat,
    errors({ stack: true }), // Capturar stack trace para erros
    logFormat
  ),
  defaultMeta: { service: 'inovacademico-backend' },
  transports: [
    fileRotateTransport,
    errorFileRotateTransport
  ]
});

// Em ambiente de desenvolvimento, também log para console com cores
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: combine(
      colorize({ all: true }),
      timestampFormat,
      errors({ stack: true }),
      logFormat
    )
  }));
}

// Helper para registrar o início de requisições HTTP
logger.logRequest = (req) => {
  logger.info(`${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    params: req.params,
    query: req.query,
    body: req.method !== 'GET' ? req.body : undefined
  });
};

// Helper para registrar o fim de requisições HTTP
logger.logResponse = (req, res, responseTime) => {
  logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${responseTime}ms`, {
    ip: req.ip,
    statusCode: res.statusCode
  });
};

// Helper para logs de erros de API
logger.logAPIError = (req, error, statusCode) => {
  logger.error(`API Error: ${req.method} ${req.originalUrl} ${statusCode}`, {
    ip: req.ip,
    statusCode,
    error: error.message,
    stack: error.stack
  });
};

// Helper para log de erros de banco de dados
logger.logDBError = (operation, error, collection) => {
  logger.error(`Database Error: ${operation} on ${collection || 'unknown'}`, {
    operation,
    collection,
    error: error.message,
    stack: error.stack
  });
};

// Middleware para Express que registra detalhes de cada requisição
logger.requestLoggerMiddleware = () => {
  return (req, res, next) => {
    // Registrar início da requisição
    logger.logRequest(req);
    
    // Registrar tempo de início
    const start = Date.now();
    
    // Interceptar finalização da resposta para registrar
    const originalEnd = res.end;
    res.end = function (...args) {
      const responseTime = Date.now() - start;
      logger.logResponse(req, res, responseTime);
      originalEnd.apply(res, args);
    };
    
    next();
  };
};

// Middleware de manipulação de erros para Express
logger.errorHandlerMiddleware = () => {
  return (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    
    // Registrar erro
    logger.logAPIError(req, err, statusCode);
    
    // Enviar resposta de erro
    res.status(statusCode).json({
      success: false,
      message: process.env.NODE_ENV === 'production' && statusCode === 500
        ? 'Erro interno do servidor'
        : err.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
    });
  };
};

// Helpers para capturar erros não tratados
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', { error: error.message, stack: error.stack });
  // Em produção, pode-se querer encerrar o processo após um erro não tratado
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection', { reason, stack: reason.stack });
});

module.exports = logger; 