/**
 * File: inovacademico/backend/src/index.js
 * Entry point for the API server
 */
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const logger = require('./utils/logger');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging middleware para todas as requisições
app.use(logger.requestLoggerMiddleware());

// Import routes
const statsRoutes = require('./routes/statsRoutes');
const referenceRoutes = require('./routes/referenceRoutes');
const bibliographyRoutes = require('./routes/bibliographyRoutes');
const logRoutes = require('./routes/logRoutes');

// API routes
app.use('/api/stats', statsRoutes);
app.use('/api/references', referenceRoutes);
app.use('/api/bibliography', bibliographyRoutes);
app.use('/api/logs', logRoutes);

// Health check endpoint
app.get('/api', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'InovAcademico API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use(logger.errorHandlerMiddleware());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/inovacademico', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  logger.info('MongoDB Connected:', mongoose.connection.host);
  
  // Start the server
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
})
.catch(err => {
  logger.error('MongoDB connection error:', err);
  process.exit(1);
});

// Handle unexpected errors
process.on('SIGINT', () => {
  logger.info('Server is shutting down');
  mongoose.connection.close()
    .then(() => {
      logger.info('MongoDB connection closed');
      process.exit(0);
    })
    .catch(err => {
      logger.error('Error closing MongoDB connection:', err);
      process.exit(1);
    });
});

module.exports = app; // For testing purposes
