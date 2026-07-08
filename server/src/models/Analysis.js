import mongoose from 'mongoose';

const AnalysisSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },
    ticker: {
      type: String,
      required: [true, 'Stock ticker symbol is required'],
      trim: true,
      uppercase: true,
      index: true // Index ticker for fast database queries
    },
    financialScore: {
      type: Number,
      min: [0, 'Financial score must be at least 0'],
      max: [100, 'Financial score cannot exceed 100']
    },
    newsScore: {
      type: Number,
      min: [0, 'News score must be at least 0'],
      max: [100, 'News score cannot exceed 100']
    },
    riskScore: {
      type: Number,
      min: [0, 'Risk score must be at least 0'],
      max: [100, 'Risk score cannot exceed 100']
    },
    finalScore: {
      type: Number,
      min: [0, 'Final score must be at least 0'],
      max: [100, 'Final score cannot exceed 100']
    },
    recommendation: {
      type: String,
      required: [true, 'Recommendation is required'],
      enum: {
        values: ['INVEST', 'HOLD', 'PASS', 'BUY', 'STRONG_BUY', 'SELL', 'STRONG_SELL', 'UNDER_REVIEW'],
        message: '{VALUE} is not a valid recommendation type'
      },
      trim: true,
      uppercase: true
    },
    confidence: {
      type: Number,
      min: [0, 'Confidence score must be at least 0'],
      max: [1, 'Confidence score cannot exceed 1 (representing 100%)']
    },
    reasoning: {
      type: String,
      required: [true, 'Analysis reasoning is required']
    },
    risks: {
      type: [String],
      default: []
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true // Index createdAt for sorting history
    }
  },
  {
    timestamps: true, // Automatically includes updatedAt
    versionKey: false // Excludes __v field for cleaner document payload
  }
);

// Compiling model
export const Analysis = mongoose.model('Analysis', AnalysisSchema);

export default Analysis;
