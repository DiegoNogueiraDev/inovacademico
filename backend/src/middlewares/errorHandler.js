/**
 * File: inovacademico/backend/src/middlewares/errorHandler.js
 * Error handling middleware
 */
const { validationResult } = require('express-validator');

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  // Check if there are validation errors
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: validationErrors.array(),
      message: 'Validation error'
    });
  }

  // Log the error for server-side debugging
  console.error('Error:', err.message);
  
  // Return appropriate error response
  if (err.response && err.response.status) {
    // Handle errors from external APIs
    return res.status(err.response.status).json({
      success: false,
      message: err.message,
      error: err.response.data
    });
  }
  
  // General error handler
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error'
  });
};

module.exports = errorHandler;