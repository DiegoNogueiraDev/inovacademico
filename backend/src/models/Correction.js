/**
 * File: inovacademico/backend/src/models/Correction.js
 * Mongoose model for bibliography corrections
 */
const mongoose = require('mongoose');

const correctionSchema = new mongoose.Schema({
  original: {
    type: String,
    required: true
  },
  corrected: {
    type: String,
    required: true
  },
  style: {
    type: String,
    enum: ['abnt', 'apa', 'vancouver', 'mla'],
    default: 'abnt'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  feedback: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  }
});

// Create a static method to get the total count
correctionSchema.statics.getTotalCount = async function() {
  return await this.countDocuments();
};

// Create a compound index for better querying when checking duplicates
correctionSchema.index({ original: 1, style: 1 });

const Correction = mongoose.model('Correction', correctionSchema);

module.exports = Correction;