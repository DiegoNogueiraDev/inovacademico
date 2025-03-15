/**
 * File: inovacademico/backend/src/models/Stats.js
 * Mongoose model for application statistics
 */
const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
  totalCorrections: {
    type: Number,
    default: 0
  },
  correctionsByStyle: {
    abnt: {
      type: Number,
      default: 0
    },
    apa: {
      type: Number,
      default: 0
    },
    vancouver: {
      type: Number,
      default: 0
    },
    mla: {
      type: Number,
      default: 0
    }
  },
  averageRating: {
    type: Number,
    default: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Only have one document for stats
statsSchema.statics.getStats = async function() {
  const stats = await this.findOne();
  if (stats) {
    return stats;
  }
  
  // Create initial stats document if it doesn't exist
  return await this.create({});
};

// Increment correction count
statsSchema.statics.incrementCorrections = async function(style) {
  const stats = await this.getStats();
  
  stats.totalCorrections += 1;
  if (style && stats.correctionsByStyle[style] !== undefined) {
    stats.correctionsByStyle[style] += 1;
  }
  stats.updatedAt = Date.now();
  
  await stats.save();
  return stats;
};

// Update average rating
statsSchema.statics.updateAverageRating = async function() {
  const Correction = mongoose.model('Correction');
  
  const result = await Correction.aggregate([
    { $match: { rating: { $ne: null } } },
    { $group: { _id: null, average: { $avg: "$rating" } } }
  ]);
  
  if (result.length > 0) {
    const stats = await this.getStats();
    stats.averageRating = Math.round(result[0].average * 10) / 10; // Round to 1 decimal place
    stats.updatedAt = Date.now();
    await stats.save();
  }
  
  return await this.getStats();
};

const Stats = mongoose.model('Stats', statsSchema);

module.exports = Stats;