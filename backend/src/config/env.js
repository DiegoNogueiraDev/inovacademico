/**
 * File: inovacademico/backend/src/config/env.js
 * Environment configuration
 */
require('dotenv').config();

// Environment configuration
const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  OPENROUTER_API_URL: process.env.OPENROUTER_API_URL,
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  MODEL_NAME: process.env.MODEL_NAME || 'gpt-3.5-turbo'
};

// Validate required environment variables
const requiredEnvVars = ['OPENROUTER_API_URL', 'OPENROUTER_API_KEY'];
const missingEnvVars = requiredEnvVars.filter(envVar => !config[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

module.exports = { config };