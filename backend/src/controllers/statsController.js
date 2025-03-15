/**
 * File: inovacademico/backend/src/controllers/statsController.js
 * Controller for statistics
 */
const Stats = require('../models/Stats');

/**
 * Statistics controller
 */
const statsController = {
  /**
   * Get current statistics
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getStats(req, res, next) {
    try {
      const stats = await Stats.getStats();
      
      return res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = statsController;