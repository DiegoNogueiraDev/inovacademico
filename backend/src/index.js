/**
 * File: inovacademico/backend/src/index.js
 * Server entry point
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { config } = require('./config/env');
const connectDB = require('./config/database');
const biblioRoutes = require('./routes/biblioRoutes');
const statsRoutes = require('./routes/statsRoutes');
const errorHandler = require('./middlewares/errorHandler');

// Initialize express app
const app = express();
const PORT = config.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/bibliography', biblioRoutes);
app.use('/api/stats', statsRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'InovAcademico API is running' });
});

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; // For testing purposes